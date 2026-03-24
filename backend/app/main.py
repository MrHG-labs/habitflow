from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import auth, habits
from app.routers import progress as progress_router
from app.routers import websocket
from app.dependencies.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Import models so SQLModel registers their tables
from app.models import user, habit, progress  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize app on startup."""
    init_db()
    yield


app = FastAPI(
    title="HabitFlow API",
    description="Backend API for HabitFlow - Gamified Habit Tracker",
    version="1.0.0",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware - restrict this to our frontend domains
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(habits.router, prefix="/api")
app.include_router(progress_router.router, prefix="/api")
app.include_router(websocket.router, prefix="/api")

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "HabitFlow API", "docs": "/docs"}