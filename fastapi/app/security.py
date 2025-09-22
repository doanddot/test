import os
from uuid import UUID

from fastapi import Depends, HTTPException
from fastapi.security import SecurityScopes, HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, ExpiredSignatureError, JWTError, JWSError
from passlib.context import CryptContext
from passlib.exc import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

from app.crud import get_user_by_email
from app.dependencies import get_session
from app.models import Role, ScopeName, TokenPayload, User
from app.redis import redis

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")


def encode_jwt(user: User, iat: int, jti: UUID, expires_delta: int) -> str:
    token_payload = TokenPayload(sub=user.email, iat=iat, jti=jti, exp=iat + expires_delta)
    if user.role:
        scopes = [s.name for s in user.role.scopes]
        if scopes:
            token_payload.scope = ' '.join(scopes)
    claims = token_payload.model_dump(mode='json', exclude_none=True)
    return jwt.encode(claims, SECRET_KEY)


def decode_jwt(token: str) -> TokenPayload:
    return TokenPayload(**jwt.decode(token, SECRET_KEY))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def get_current_user(
    security_scopes: SecurityScopes,
    session: Session = Depends(get_session),
    token: HTTPAuthorizationCredentials = Depends(HTTPBearer())
) -> User:
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"

    credentials_exception = HTTPException(
        status_code=401,
        detail="Не удалось подтвердить учетные данные",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        token_payload = decode_jwt(token.credentials)
        if token_payload.sub is None:
            raise credentials_exception
    except (InvalidTokenError, ValidationError, ExpiredSignatureError, JWTError, JWSError):
        raise credentials_exception

    db_user = get_user_by_email(token_payload.sub, session)

    if (
        db_user is None
        or db_user.email != token_payload.sub
        or not redis.exists(f'user:{db_user.id}:access_token:{token_payload.jti}')
    ):
        raise credentials_exception
    if not db_user.is_active:
        raise HTTPException(status_code=400, detail="Неактивный пользователь")
    if not db_user.is_superuser:
        for scope in security_scopes.scopes:
            if scope not in [s.name for s in db_user.role.scopes]:
                raise HTTPException(
                    status_code=401,
                    detail="Недостаточно прав",
                    headers={"WWW-Authenticate": authenticate_value},
                )

    return db_user
