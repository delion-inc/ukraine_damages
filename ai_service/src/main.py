# main.py
import logging
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from routers import ai

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router, prefix="", tags=["Rating"])

if __name__ == "__main__":
    import uvicorn
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    logger.info("Starting FastAPI application...")
    uvicorn.run(app, host="127.0.0.1", port=8000)