import pandas as pd
import numpy as np

class Optimization:
    def __init__(self, cols=None, target_col='Price'):
        self.cols = cols
        self.target_col = target_col
        self.mappings = {}
        self.global_mean = None

    def fit(self, X, y):
        # Join X and y temporarily
        df = X.copy()
        df[self.target_col] = y
        self.global_mean = y.mean()

        for col in self.cols:
            if col in df.columns:
                # Calculate mean per category
                means = df.groupby(col)[self.target_col].mean()
                self.mappings[col] = means.to_dict()
        
        return self

    def transform(self, X):
        X_out = X.copy()
        for col in self.cols:
            if col in X_out.columns:
                # Map means
                # Use map, fillna with global_mean for unseen categories
                if col in self.mappings:
                    X_out[col] = X_out[col].map(self.mappings[col]).fillna(self.global_mean)
                else:
                    # If column somehow missing from mappings, fill global mean
                    X_out[col] = self.global_mean
        return X_out
