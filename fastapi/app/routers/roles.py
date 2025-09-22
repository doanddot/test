from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy import delete
from sqlmodel import Session, select

from app.crud import get_role_by_name, get_scopes
from app.dependencies import get_session
from app.models import Role, RoleCreate, RolePublic, RoleUpdate, RoleScope, Scope, ScopeName, User
from app.security import get_current_user


router = APIRouter(prefix="/roles", tags=["Roles"])


@router.post("")
async def create_role(
    role_create: RoleCreate,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.ROLES_CREATE])
) -> RolePublic:
    db_role = get_role_by_name(role_create.name, session)
    if db_role:
        raise HTTPException(status_code=400, detail={"name": "Роль c таким именем уже существует"})

    role = Role(name=role_create.name)

    db_scopes = get_scopes(session, role_create.scopes)
    role.scopes.extend(db_scopes)

    session.add(role)
    session.commit()
    session.refresh(role)

    return RolePublic(
        id=role.id,
        name=role.name,
        scopes=[s.name for s in role.scopes]
    )


@router.get("")
async def read_roles(
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.ROLES_READ])
) -> list[RolePublic]:
    db_roles = session.exec(select(Role)).all()

    return [
        RolePublic(
            id=db_role.id,
            name=db_role.name,
            scopes=[s.name for s in db_role.scopes]
        ) for db_role in db_roles
    ]


@router.get("/{role_id}")
async def read_role(
    role_id: int,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.ROLES_READ])
) -> RolePublic:
    db_role = session.get(Role, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Роли с таким идентификатором не существует")

    return RolePublic(
        id=db_role.id,
        name=db_role.name,
        scopes=[s.name for s in db_role.scopes]
    )


@router.put("/{role_id}")
async def update_role(
    role_id: int,
    role_update: RoleUpdate,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.ROLES_UPDATE])
) -> RolePublic:
    db_role = session.get(Role, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Роли с таким идентификатором не существует")

    db_role.name = role_update.name

    session.exec(delete(RoleScope).where(RoleScope.role_id == db_role.id))

    db_scopes = get_scopes(session, role_update.scopes)
    db_role.scopes.extend(db_scopes)

    session.add(db_role)
    session.commit()
    session.refresh(db_role)

    return RolePublic(
        id=db_role.id,
        name=db_role.name,
        scopes=[s.name for s in db_role.scopes]
    )


@router.delete("/{role_id}")
async def delete_role(
    role_id: int,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.ROLES_DELETE])
):
    db_role = session.get(Role, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Роли с таким идентификатором не существует")

    session.delete(db_role)
    session.commit()
