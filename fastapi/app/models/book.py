from sqlmodel import SQLModel, Field


class Book(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    year: int
    title: str
    publisher: str
    pages: int


class BookCreate(SQLModel):
    year: int
    title: str
    publisher: str
    pages: int


class BookPublic(SQLModel):
    id: int
    year: int
    title: str
    publisher: str
    pages: int


class BookUpdate(SQLModel):
    year: int
    title: str
    publisher: str
    pages: int
