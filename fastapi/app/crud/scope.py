from sqlmodel import Session, select

from app.models import Scope, ScopeName


def get_scopes(session: Session, scopes: list[ScopeName] | None = None) -> list[Scope]:
    statement = select(Scope)
    if scopes is not None:
        statement = statement.where(Scope.name.in_([scope.value for scope in scopes]))

        print([scope.value for scope in scopes])

    return session.exec(statement).all()
