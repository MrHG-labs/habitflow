from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import auth, habits
from app.routers import progress as progress_router

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

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(habits.router, prefix="/api")
app.include_router(progress_router.router, prefix="/api")


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "HabitFlow API", "docs": "/docs"}