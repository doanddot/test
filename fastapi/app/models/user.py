from pydantic import EmailStr
from sqlmodel import Field, SQLModel, Relationship

from .role import Role


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True)
    password: str
    name: str
    surname: str
    is_superuser: bool = Field(default=False)
    is_active: bool = Field(default=True)

    role_id: int | None = Field(default=None, foreign_key="role.id")

    role: Role | None = Relationship(back_populates="users")


class UserRegister(SQLModel):
    email: EmailStr
    password: str
    name: str
    surname: str


class UserCreate(SQLModel):
    email: EmailStr
    password: str
    name: str
    surname: str
    is_superuser: bool

    role_id: int | None = None


class UserPublic(SQLModel):
    id: int
    email: str
    name: str
    surname: str
    is_superuser: bool
    is_active: bool

    role: Role | None = None


class UserUpdate(SQLModel):
    email: EmailStr | None = None
    name: str | None = None
    password: str | None = None
    surname: str | None = None
    is_superuser: bool | None = None
    is_active: bool | None = None

    role_id: int | None = None
