from sqlmodel import Field, SQLModel

from .scope_name import ScopeName


class RoleScope(SQLModel, table=True):
    role_id: int = Field(foreign_key="role.id", primary_key=True)
    scope_name: str = Field(foreign_key="scope.name", primary_key=True)
