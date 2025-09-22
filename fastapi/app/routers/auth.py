from time import time
from uuid import UUID, uuid4

from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlmodel import Session

from app.crud import get_user_by_email
from app.dependencies import get_session
from app.models.token import TokenGrantType, TokenObtain, TokenRefresh, TokenRevoke, TokenPair
from app.models.user import User, UserRegister, UserPublic
from app.redis import redis
from app.security import encode_jwt, decode_jwt, get_current_user, verify_password, get_password_hash

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/sign-up")
def sign_up(
    user_register: UserRegister,
    session: Session = Depends(get_session)
) -> UserPublic:
    db_user = get_user_by_email(user_register.email, session)
    if db_user:
        raise HTTPException(status_code=400, detail={"email": "Пользователя c указанным E-mail уже существует"})

    db_user = User.model_validate(
        user_register,
        update={
            "password": get_password_hash(user_register.password),
            "role_id": 1,  # TODO: hm...
        }
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.post("/token")
def get_token_pair(
    body: TokenObtain | TokenRefresh = Body(
        openapi_examples={
            "Obtain": {
                "value": {
                    "grant_type": TokenGrantType.CLIENT_CREDENTIALS,
                    "email": "string",
                    "password": "string",
                },
            },
            "Refresh": {
                "value": {
                    "grant_type": TokenGrantType.REFRESH_TOKEN,
                    "refresh_token": "string"
                },
            },
        }
    ),
    session: Session = Depends(get_session)
) -> TokenPair:
    db_user: User
    jti: UUID

    if body.grant_type == TokenGrantType.CLIENT_CREDENTIALS:
        db_user = get_user_by_email(body.email, session)
        jti = uuid4()
        if not db_user:
            raise HTTPException(status_code=401, detail={"email": "Пользователя c указанным E-mail не существует"})
        if not verify_password(body.password, db_user.password):
            raise HTTPException(status_code=401, detail={"password": "Неверный пароль"})

    if body.grant_type == TokenGrantType.REFRESH_TOKEN:
        token_payload = decode_jwt(body.refresh_token)
        db_user = get_user_by_email(token_payload.sub, session)
        if not db_user:
            raise HTTPException(status_code=401)
        jti = token_payload.jti
        if not redis.exists(f'user:{db_user.id}:refresh_token:{jti}'):
            raise HTTPException(status_code=401)

    if not db_user.is_active:
        raise HTTPException(status_code=400, detail="Неактивный пользователь")

    iat = int(time())

    expires_delta = 15 * 60
    access_token = encode_jwt(db_user, iat, jti, expires_delta)
    redis.set(f'user:{db_user.id}:access_token:{jti}', access_token, ex=expires_delta)

    expires_delta = 30 * 24 * 60 * 60
    refresh_token = encode_jwt(db_user, iat, jti, expires_delta)
    redis.set(f'user:{db_user.id}:refresh_token:{jti}', refresh_token, ex=expires_delta)

    return TokenPair(access_token=access_token, refresh_token=refresh_token)


@router.post("/revoke")
def revoke_token(body: TokenRevoke, current_user: User = Security(get_current_user)):
    token_payload = decode_jwt(body.refresh_token)

    if current_user.email == token_payload.sub:
        redis.delete(f'user:{current_user.id}:access_token:{token_payload.jti}')
        redis.delete(f'user:{current_user.id}:refresh_token:{token_payload.jti}')
