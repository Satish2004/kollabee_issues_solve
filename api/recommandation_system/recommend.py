import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import LabelEncoder
from scipy.sparse import csr_matrix
from sqlalchemy import text
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

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
        df = data if isinstance(data, pd.DataFrame) else pd.DataFrame(data)

        print("Sample data:\n", df.head())

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

        # Fetch full product details using SQLAlchemy
        placeholders = ', '.join(f"'{pid}'" for pid in top_product_ids)
        query = text(f"SELECT * FROM \"Product\" WHERE id IN ({placeholders})")

        with engine.connect() as conn:
            result = conn.execute(query)
            product_data = [dict(row._mapping) for row in result]

        return product_data
