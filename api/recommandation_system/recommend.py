import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import LabelEncoder
from scipy.sparse import csr_matrix
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

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
        self.buyer_enc.fit(df['buyer_id'])
        self.product_enc.fit(df['product_id'])

        buyer_ids = self.buyer_enc.transform(df['buyer_id'])
        product_ids = self.product_enc.transform(df['product_id'])
        interactions = df['interaction'].astype(float)

        self.interaction_matrix = csr_matrix(
            (interactions, (buyer_ids, product_ids)),
            shape=(len(self.buyer_enc.classes_), len(self.product_enc.classes_))
        )

        self.model = TruncatedSVD(n_components=min(20, min(self.interaction_matrix.shape) - 1))
        self.buyer_features = self.model.fit_transform(self.interaction_matrix)
        self.product_features = self.model.components_.T

    def recommend(self, buyer_id, top_k=5):
        if buyer_id not in self.buyer_enc.classes_:
            return []

        buyer_idx = self.buyer_enc.transform([buyer_id])[0]
        scores = self.product_features @ self.buyer_features[buyer_idx]
        buyer_interactions = self.interaction_matrix[buyer_idx].toarray().flatten()
        scores[buyer_interactions > 0] = -np.inf

        top_product_idxs = np.argsort(scores)[-top_k:][::-1]
        top_product_ids = self.product_enc.inverse_transform(top_product_idxs)

        placeholders = ', '.join(f"'{pid}'" for pid in top_product_ids)
        query = text(f"SELECT * FROM \"Product\" WHERE id IN ({placeholders})")

        with engine.connect() as conn:
            result = conn.execute(query)
            return [dict(row._mapping) for row in result]

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
            print("⚠️ No supplier interaction data provided.")
            return

        self.buyer_enc.fit(df['buyer_id'])
        self.supplier_enc.fit(df['supplier_id'])

        buyer_ids = self.buyer_enc.transform(df['buyer_id'])
        supplier_ids = self.supplier_enc.transform(df['supplier_id'])
        interactions = df['interaction'].astype(float)

        self.interaction_matrix = csr_matrix(
            (interactions, (buyer_ids, supplier_ids)),
            shape=(len(self.buyer_enc.classes_), len(self.supplier_enc.classes_))
        )

        print("✅ Supplier interaction matrix shape:", self.interaction_matrix.shape)
        print("🔢 Total interaction value:", self.interaction_matrix.sum())

        if self.interaction_matrix.sum() == 0:
            print("⚠️ Interaction matrix has no variance. Skipping SVD training.")
            return

        # Safe n_components
        n_components = max(1, min(20, min(self.interaction_matrix.shape) - 1))
        if n_components < 1:
            print("⚠️ Not enough data to train. Skipping.")
            return

        self.model = TruncatedSVD(n_components=n_components)

        try:
            self.buyer_features = self.model.fit_transform(self.interaction_matrix)
            self.supplier_features = self.model.components_.T
            print("✅ SVD model trained for supplier recommendation.")
        except Exception as e:
            print(f"❌ Error training SVD model: {e}")

    def recommend(self, buyer_id, top_k=5):
        if buyer_id not in self.buyer_enc.classes_:
            return []

        buyer_idx = self.buyer_enc.transform([buyer_id])[0]
        scores = self.supplier_features @ self.buyer_features[buyer_idx]
        buyer_interactions = self.interaction_matrix[buyer_idx].toarray().flatten()
        scores[buyer_interactions > 0] = -np.inf

        top_supplier_idxs = np.argsort(scores)[-top_k:][::-1]
        top_supplier_ids = self.supplier_enc.inverse_transform(top_supplier_idxs)

        placeholders = ', '.join(f"'{sid}'" for sid in top_supplier_ids)
        query = text(f"SELECT * FROM \"User\" WHERE id IN ({placeholders})")

        with engine.connect() as conn:
            result = conn.execute(query)
            return [dict(row._mapping) for row in result]
