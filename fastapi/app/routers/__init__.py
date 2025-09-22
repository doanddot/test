from fastapi import APIRouter

from .auth import router as auth_router
from .books import router as books_router
from .roles import router as roles_router
from .users import router as users_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(books_router)
router.include_router(roles_router)
router.include_router(users_router)
