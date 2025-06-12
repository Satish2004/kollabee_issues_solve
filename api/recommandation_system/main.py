from fastapi import FastAPI
from recommend import Recommender, SupplierRecommender
from database_fetch import fetch_interactions, fetch_supplier_interactions
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import threading
import time

app = FastAPI()
recommender = Recommender()
supplier_recommender = SupplierRecommender()

# CORS setup
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

@app.get("/recommend-suppliers/{buyer_id}")
def get_supplier_recommendations(buyer_id: str, top_k: int = 5):
    return {"recommended_suppliers": supplier_recommender.recommend(buyer_id, top_k)}

def update_model():
    product_data = fetch_interactions()
    supplier_data = fetch_supplier_interactions()

    df_products = pd.DataFrame(product_data)
    df_suppliers = pd.DataFrame(supplier_data)

    if not df_products.empty:
        recommender.fit(df_products)

    if not df_suppliers.empty:
        supplier_recommender.fit(df_suppliers)

def auto_retrain(interval=60):
    while True:
        time.sleep(interval)
        update_model()
