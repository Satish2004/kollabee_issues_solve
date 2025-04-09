from fastapi import FastAPI
from recommend import Recommender
from database_fetch import fetch_interactions
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import threading
import time

app = FastAPI()
recommender = Recommender()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    update_model()
    threading.Thread(target=auto_retrain, daemon=True).start()

@app.get("/recommendations/{buyer_id}")
def get_recommendations(buyer_id: str, top_k: int = 5):
    return {"recommended_products": recommender.recommend(buyer_id, top_k)}

def update_model():
    interactions = fetch_interactions()
    df = pd.DataFrame(interactions)
    if not df.empty:
        recommender.fit(df)

def auto_retrain(interval=60):
    while True:
        time.sleep(interval)
        update_model()
