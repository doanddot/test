from sqlmodel import SQLModel, Field, Relationship

from .scope_name import ScopeName
from .role_scope import RoleScope


class Role(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)

    users: list["User"] = Relationship(back_populates="role")
    scopes: list["Scope"] = Relationship(back_populates="roles", link_model=RoleScope)


class RolePublic(SQLModel):
    id: int
    name: str

    scopes: list[ScopeName] = []


class RoleCreate(SQLModel):
    name: str

    scopes: list[ScopeName] = []


class RoleUpdate(SQLModel):
    name: str

    scopes: list[ScopeName] = []
