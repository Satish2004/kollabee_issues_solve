import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import LabelEncoder
from scipy.sparse import csr_matrix
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
import logging

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Configure logging to see the new messages
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Recommender:
    def __init__(self):
        self.buyer_enc = LabelEncoder()
        self.product_enc = LabelEncoder()
        self.model = None
        self.buyer_features = None
        self.product_features = None
        self.interaction_matrix = None

    def fit(self, data):
        df = pd.DataFrame(data)
        if df.empty:
            logging.warning("Product recommender: No interaction data provided. Model not trained.")
            return

        logging.info("Product recommender: Fitting model...")
        self.buyer_enc.fit(df['buyer_id'])
        self.product_enc.fit(df['product_id'])

        buyer_ids = self.buyer_enc.transform(df['buyer_id'])
        product_ids = self.product_enc.transform(df['product_id'])
        interactions = df['interaction'].astype(float)

        self.interaction_matrix = csr_matrix(
            (interactions, (buyer_ids, product_ids)),
            shape=(len(self.buyer_enc.classes_), len(self.product_enc.classes_))
        )
        
        n_components = min(20, min(self.interaction_matrix.shape) - 1)
        if n_components < 1:
            logging.warning("Product recommender: Not enough data to train SVD model. Skipping.")
            return

        self.model = TruncatedSVD(n_components=n_components)
        self.buyer_features = self.model.fit_transform(self.interaction_matrix)
        self.product_features = self.model.components_.T
        logging.info("Product recommender: Model fitting complete.")

    def recommend(self, buyer_id, top_k=5):
        logging.info(f"--- Generating recommendations for buyer_id: {buyer_id} ---")
        
        if self.model is None:
            logging.warning("Product recommender model is not trained. Cannot generate recommendations.")
            return []

        if buyer_id not in self.buyer_enc.classes_:
            logging.warning(f"Buyer_id '{buyer_id}' not found in training data. Cannot generate recommendations.")
            return []

        buyer_idx = self.buyer_enc.transform([buyer_id])[0]
        logging.info(f"Buyer is known. Internal index: {buyer_idx}.")

        scores = self.product_features @ self.buyer_features[buyer_idx]
        
        buyer_interactions = self.interaction_matrix[buyer_idx].toarray().flatten()
        num_interacted_items = np.sum(buyer_interactions > 0)
        logging.info(f"Buyer has interacted with {num_interacted_items} items. These will be excluded.")
        
        scores[buyer_interactions > 0] = -np.inf

        k = min(top_k, len(scores))
        top_product_idxs = np.argsort(scores)[-k:][::-1]
        
        valid_recommendations_idxs = [idx for idx in top_product_idxs if scores[idx] > -np.inf]

        if not valid_recommendations_idxs:
            logging.warning(f"No new products to recommend for buyer_id: {buyer_id}. All potential items were filtered out.")
            return []

        logging.info(f"Found {len(valid_recommendations_idxs)} valid new products to recommend.")

        top_product_ids = self.product_enc.inverse_transform(valid_recommendations_idxs)
        logging.info(f"Top recommended product IDs: {top_product_ids.tolist()}")

        if len(top_product_ids) == 0:
            return []

        placeholders = ', '.join(f"'{pid}'" for pid in top_product_ids)
        query = text(f'SELECT id, name, price, description, images, "sellerId" FROM "Product" WHERE id IN ({placeholders})')

        with engine.connect() as conn:
            result = conn.execute(query)
            recommendations = [dict(row._mapping) for row in result]
            logging.info(f"Successfully fetched details for {len(recommendations)} products from the database.")
            return recommendations

class SupplierRecommender:
    def __init__(self):
        self.buyer_enc = LabelEncoder()
        self.supplier_enc = LabelEncoder()
        self.model = None
        self.buyer_features = None
        self.supplier_features = None
        self.interaction_matrix = None

    def fit(self, data):
        df = pd.DataFrame(data)
        if df.empty:
            logging.warning("Supplier recommender: No interaction data provided. Model not trained.")
            return

        logging.info("Supplier recommender: Fitting model...")
        self.buyer_enc.fit(df['buyer_id'])
        self.supplier_enc.fit(df['supplier_id'])

        buyer_ids = self.buyer_enc.transform(df['buyer_id'])
        supplier_ids = self.supplier_enc.transform(df['supplier_id'])
        interactions = df['interaction'].astype(float)

        self.interaction_matrix = csr_matrix(
            (interactions, (buyer_ids, supplier_ids)),
            shape=(len(self.buyer_enc.classes_), len(self.supplier_enc.classes_))
        )

        n_components = max(1, min(20, min(self.interaction_matrix.shape) - 1))
        if n_components < 1:
            logging.warning("Supplier recommender: Not enough data to train SVD model. Skipping.")
            return

        self.model = TruncatedSVD(n_components=n_components)
        self.buyer_features = self.model.fit_transform(self.interaction_matrix)
        self.supplier_features = self.model.components_.T
        logging.info("Supplier recommender: Model fitting complete.")


    def recommend(self, buyer_id, top_k=5):
        logging.info(f"--- Generating supplier recommendations for buyer_id: {buyer_id} ---")
        
        if self.model is None:
            logging.warning("Supplier recommender model is not trained. Cannot generate recommendations.")
            return []

        if buyer_id not in self.buyer_enc.classes_:
            logging.warning(f"Buyer_id '{buyer_id}' not found in supplier training data. Cannot generate recommendations.")
            return []

        buyer_idx = self.buyer_enc.transform([buyer_id])[0]
        logging.info(f"Buyer is known. Internal index: {buyer_idx}.")
        
        scores = self.supplier_features @ self.buyer_features[buyer_idx]
        
        buyer_interactions = self.interaction_matrix[buyer_idx].toarray().flatten()
        num_interacted_items = np.sum(buyer_interactions > 0)
        logging.info(f"Buyer has interacted with {num_interacted_items} suppliers. These will be excluded.")
        
        scores[buyer_interactions > 0] = -np.inf

        k = min(top_k, len(scores))
        top_supplier_idxs = np.argsort(scores)[-k:][::-1]
        
        valid_recommendations_idxs = [idx for idx in top_supplier_idxs if scores[idx] > -np.inf]

        if not valid_recommendations_idxs:
            logging.warning(f"No new suppliers to recommend for buyer_id: {buyer_id}. All potential suppliers were filtered out.")
            return []
            
        logging.info(f"Found {len(valid_recommendations_idxs)} valid new suppliers to recommend.")

        top_supplier_ids = self.supplier_enc.inverse_transform(valid_recommendations_idxs)
        logging.info(f"Top recommended supplier IDs: {top_supplier_ids.tolist()}")

        if len(top_supplier_ids) == 0:
            return []

        placeholders = ', '.join(f"'{sid}'" for sid in top_supplier_ids)
        query = text(f'SELECT id, name, email, "companyName", "imageUrl" FROM "User" WHERE id IN ({placeholders})')

        with engine.connect() as conn:
            result = conn.execute(query)
            recommendations = [dict(row._mapping) for row in result]
            logging.info(f"Successfully fetched details for {len(recommendations)} suppliers from the database.")
            return recommendations
