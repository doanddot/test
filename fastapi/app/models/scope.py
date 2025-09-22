from sqlmodel import SQLModel, Field, Relationship, AutoString

from .role_scope import RoleScope
from .scope_name import ScopeName


class Scope(SQLModel, table=True):
    name: ScopeName = Field(sa_type=AutoString, primary_key=True)

    roles: list["Role"] = Relationship(back_populates="scopes", link_model=RoleScope)
