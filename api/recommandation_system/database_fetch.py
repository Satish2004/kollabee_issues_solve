import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import logging

# --- Setup basic logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

# Ensure you have your DATABASE_URL in a .env file or as an environment variable
# I'm using the one from your original file as a placeholder.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_NRhXSot9PaB8@ep-late-hat-a5uappt3-pooler.us-east-2.aws.neon.tech/kollabee?sslmode=require")

engine = create_engine(DATABASE_URL)

def fetch_interactions():
    """
    Fetches user-product interactions from orders, carts, and wishlists.
    The queries are updated to correctly join through the 'Buyer' table to get the actual user ID.
    """
    logging.info("Fetching product interactions...")
    with engine.connect() as conn:
        # Fetch completed orders (interaction score: 1.0)
        orders_query = text("""
            SELECT b."userId" as buyer_id, oi."productId" as product_id, 1.0 as interaction
            FROM "OrderItem" oi
            JOIN "Order" o ON oi."orderId" = o.id
            JOIN "Buyer" b ON o."buyerId" = b.id
            WHERE o."buyerId" IS NOT NULL
        """)
        orders = conn.execute(orders_query).fetchall()
        logging.info(f"Found {len(orders)} interactions from Orders.")

        # Fetch cart items (interaction score: 0.5)
        cart_query = text("""
            SELECT b."userId" as buyer_id, ci."productId" as product_id, 0.5 as interaction
            FROM "CartItem" ci
            JOIN "Cart" c ON ci."cartId" = c.id
            JOIN "Buyer" b ON c."buyerId" = b.id
        """)
        cart = conn.execute(cart_query).fetchall()
        logging.info(f"Found {len(cart)} interactions from Carts.")

        # Fetch wishlist items (interaction score: 0.3)
        wishlist_query = text("""
            SELECT b."userId" as buyer_id, wi."productId" as product_id, 0.3 as interaction
            FROM "WishlistItem" wi
            JOIN "Wishlist" w ON wi."wishlistId" = w.id
            JOIN "Buyer" b ON w."buyerId" = b.id
        """)
        wishlist = conn.execute(wishlist_query).fetchall()
        logging.info(f"Found {len(wishlist)} interactions from Wishlists.")

    all_data = orders + cart + wishlist
    if not all_data:
        logging.warning("No product interactions found in the database. The recommender will not be trained.")
        return pd.DataFrame(columns=["buyer_id", "product_id", "interaction"]).to_dict(orient="records")
        
    logging.info(f"Total product interactions found: {len(all_data)}")
    df = pd.DataFrame(all_data, columns=["buyer_id", "product_id", "interaction"])
    return df.to_dict(orient="records")

def fetch_supplier_interactions():
    """
    Fetches buyer-supplier interactions from completed orders.
    The query is updated to join through both 'Buyer' and 'Seller' tables
    to get the correct user IDs for both parties.
    """
    logging.info("Fetching supplier interactions...")
    with engine.connect() as conn:
        # The 'supplier_id' is now the seller's actual user ID from the User table.
        orders_query = text("""
            SELECT b."userId" as buyer_id, s."userId" as supplier_id, 1.0 as interaction
            FROM "OrderItem" oi
            JOIN "Order" o ON oi."orderId" = o.id
            JOIN "Buyer" b ON o."buyerId" = b.id
            JOIN "Product" p ON oi."productId" = p.id
            JOIN "Seller" s ON p."sellerId" = s.id
            WHERE o."buyerId" IS NOT NULL AND p."sellerId" IS NOT NULL
        """)
        orders = conn.execute(orders_query).fetchall()

    if not orders:
         logging.warning("No supplier interactions found in the database. The supplier recommender will not be trained.")
         return pd.DataFrame(columns=["buyer_id", "supplier_id", "interaction"]).to_dict(orient="records")

    logging.info(f"Total supplier interactions found: {len(orders)}")
    df = pd.DataFrame(orders, columns=["buyer_id", "supplier_id", "interaction"])
    return df.to_dict(orient="records")
