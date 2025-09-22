from fastapi import APIRouter, Depends, HTTPException
from fastapi import Security
from sqlmodel import Session, select

from app.dependencies import get_session
from app.models import Book, BookCreate, BookPublic, BookUpdate, ScopeName, User
from app.security import get_current_user


router = APIRouter(prefix="/books", tags=["Books"])


@router.post("")
async def create_books(
    book_create: BookCreate,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.BOOKS_CREATE])
) -> BookPublic:
    book = Book.model_validate(book_create)

    session.add(book)
    session.commit()
    session.refresh(book)

    return book


@router.get("")
async def read_books(
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.BOOKS_READ])
) -> list[BookPublic]:
    return session.exec(select(Book)).all()


@router.get("/{book_id}")
async def read_book(
    book_id: int,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.BOOKS_READ])
) -> BookPublic:
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Книга с таким идентификатором не существует")

    return db_book


@router.patch("/{book_id}")
async def update_books(
    book_id: int,
    book_update: BookUpdate,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.BOOKS_UPDATE])
) -> BookPublic:
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Книга с таким идентификатором не существует")

    book_data = book_update.model_dump(exclude_unset=True)

    db_book.sqlmodel_update(book_data)

    session.add(db_book)
    session.commit()
    session.refresh(db_book)

    return db_book


@router.delete("/{book_id}")
async def delete_books(
    book_id: int,
    session: Session = Depends(get_session),
    current_user: User = Security(get_current_user, scopes=[ScopeName.BOOKS_DELETE])
):
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Книга с таким идентификатором не существует")

    session.delete(db_book)
    session.commit()
