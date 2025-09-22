from fastapi import APIRouter, Security, Depends, HTTPException
from sqlmodel import Session, select

from app.crud import get_user_by_email
from app.dependencies import get_session
from app.models import ScopeName, User, UserCreate, UserPublic, UserUpdate
from app.security import get_current_user, get_password_hash

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def read_users_me(current_user: User = Security(get_current_user)) -> UserPublic:
    return current_user


@router.patch("/me")
def update_users_me(
    user_update: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user)
) -> UserPublic:
    db_user = session.get(User, current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь с таким идентификатором не существует")

    existing_user = get_user_by_email(user_update.email, session)
    if existing_user and existing_user.id != current_user.id:
        raise HTTPException(status_code=409, detail="Пользователь с таким E-mail уже существует")

    user_data = user_update.model_dump(exclude_defaults=True)
    extra_data = {}
    if user_update.password is not None:
        extra_data["password"] = get_password_hash(user_update.password)

    db_user.sqlmodel_update(user_data, update=extra_data)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.delete("/me")
def delete_users_me(
    current_user: User = Security(get_current_user),
    session: Session = Depends(get_session),
):
    db_user = session.get(User, current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь с таким идентификатором не существует")

    db_user.is_active = False

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.post("")
def create_user(
    user_create: UserCreate,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.USERS_CREATE])
) -> UserPublic:
    db_user = get_user_by_email(user_create.email, session)
    if db_user:
        raise HTTPException(status_code=400, detail={"email": "Пользователя c указанным E-mail уже существует"})

    user = User.model_validate(
        user_create,
        update={
            "password": get_password_hash(user_create.password)
        }
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.get("")
def read_users(
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.USERS_READ])
) -> list[UserPublic]:
    return session.exec(select(User)).all()


@router.get("/{user_id}")
def read_user(
    user_id: int, session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.USERS_READ])
) -> UserPublic:
    return session.get(User, user_id)


@router.patch("/{user_id}")
def update_user(
    user_id: int,
    user_update: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.USERS_UPDATE])
) -> UserPublic:
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь с таким идентификатором не существует")

    existing_user = get_user_by_email(user_update.email, session)
    if existing_user and existing_user.id != user_id:
        raise HTTPException(status_code=409, detail="Пользователь с таким E-mail уже существует")

    user_data = user_update.model_dump(exclude_defaults=True)
    extra_data = {}
    if user_update.password is not None:
        extra_data["password"] = get_password_hash(user_update.password)

    db_user.sqlmodel_update(user_data, update=extra_data)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.USERS_DELETE])
) -> UserPublic:
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь с таким идентификатором не существует")

    db_user.is_active = False

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user
