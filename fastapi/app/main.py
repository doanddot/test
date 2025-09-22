import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from sqlmodel import Session, select

from app.database import engine
from app.models import Scope, ScopeName
from app.routers import router


def custom_generate_unique_id(route: APIRoute):
    return f'{list(route.methods)[0].lower()}_{re.sub("^_|{|}|_$", "", re.sub("-|/", "_", route.path))}'


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
def on_startup():
    with Session(engine) as session:
        db_scopes = session.exec(select(Scope.name)).all()
        db_scopes_set = set(db_scopes)
        enum_scopes_set = set(scope.value for scope in ScopeName)

        for scope in enum_scopes_set - db_scopes_set:
            session.add(Scope(name=scope))

        for scope in db_scopes_set - enum_scopes_set:
            scope_obj = session.get(Scope, scope)
            if scope_obj:
                session.delete(scope_obj)

        session.commit()
