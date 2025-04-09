import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def fetch_interactions():
    with engine.connect() as conn:
        orders = conn.execute(text("""
            SELECT o."buyerId", oi."productId", 1.0 as interaction
            FROM "OrderItem" oi
            JOIN "Order" o ON oi."orderId" = o.id
        """)).fetchall()

        cart = conn.execute(text("""
            SELECT c."buyerId", ci."productId", 0.5 as interaction
            FROM "CartItem" ci
            JOIN "Cart" c ON ci."cartId" = c.id
        """)).fetchall()

        wishlist = conn.execute(text("""
            SELECT w."buyerId", wi."productId", 0.3 as interaction
            FROM "WishlistItem" wi
            JOIN "Wishlist" w ON wi."wishlistId" = w.id
        """)).fetchall()

    all_data = orders + cart + wishlist
    df = pd.DataFrame(all_data, columns=["buyer_id", "product_id", "interaction"])
    return df.to_dict(orient="records")
