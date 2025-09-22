from sqlmodel import select, Session

from app.models.role import Role


def get_role_by_name(name: str, session: Session) -> Role | None:
    statement = select(Role).where(Role.name == name)

    return session.exec(statement).one_or_none()

