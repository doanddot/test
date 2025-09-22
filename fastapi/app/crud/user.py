from sqlmodel import select, Session

from app.models.user import User


def get_user_by_email(email: str, session: Session) -> User | None:
    statement = select(User).where(User.email == email)

    return session.exec(statement).one_or_none()

