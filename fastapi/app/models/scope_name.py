from enum import StrEnum


class ScopeName(StrEnum):
    BOOKS_CREATE = "books:create"
    BOOKS_READ = "books:read"
    BOOKS_UPDATE = "books:update"
    BOOKS_DELETE = "books:delete"

    ROLES_CREATE = "roles:create"
    ROLES_READ = "roles:read"
    ROLES_UPDATE = "roles:update"
    ROLES_DELETE = "roles:delete"

    USERS_CREATE = "users:create"
    USERS_READ = "users:read"
    USERS_UPDATE = "users:update"
    USERS_DELETE = "users:delete"
