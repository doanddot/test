from enum import StrEnum
from uuid import UUID

from sqlmodel import SQLModel


class TokenGrantType(StrEnum):
    CLIENT_CREDENTIALS = "client_credentials"
    REFRESH_TOKEN = "refresh_token"


class TokenObtain(SQLModel):
    grant_type: TokenGrantType = TokenGrantType.CLIENT_CREDENTIALS
    email: str
    password: str


class TokenRefresh(SQLModel):
    grant_type: TokenGrantType = TokenGrantType.REFRESH_TOKEN
    refresh_token: str


class TokenPair(SQLModel):
    access_token: str
    refresh_token: str


class TokenPayload(SQLModel):
    sub: str
    iat: int
    jti: UUID = None
    exp: int
    scope: str = None


class TokenRevoke(SQLModel):
    refresh_token: str
