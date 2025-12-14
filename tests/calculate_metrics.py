import pandas as pd
import numpy as np
import joblib
import argparse
import sys
import os
from sklearn.metrics import r2_score, mean_squared_error

# Add parent directory to path to import encoder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from encoder import Optimization

def clean_price(price_str):
    """Clean price string to integer."""
    if pd.isna(price_str):
        return np.nan
    clean_str = str(price_str).replace(' TL', '').replace('.', '').strip()
    try:
        return int(clean_str)
    except ValueError:
        return np.nan

def clean_rooms(room_str):
    """Convert '3+1' format to total rooms."""
    if pd.isna(room_str):
        return np.nan
    try:
        parts = str(room_str).split('+')
        return sum(int(p) for p in parts)
    except:
        if "Stüdyo" in str(room_str):
            return 1
        return np.nan

def clean_age(age_str):
    """Convert age string to numeric."""
    if pd.isna(age_str):
        return np.nan
    s = str(age_str)
    if "0" == s: return 0
    if "1-5" in s: return 3
    if "5-10" in s: return 7.5
    if "11-15" in s: return 13
    if "16-20" in s: return 18
    if "21-25" in s: return 23
    if "26-30" in s: return 28
    if "31 ve üzeri" in s: return 35
    try:
        return int(s)
    except:
        return np.nan

def clean_balcony(val):
    if pd.isna(val): return 0
    if 'Available' in str(val) or 'Yes' in str(val): return 1
    return 0

def main():
    parser = argparse.ArgumentParser(description='Calculate R2 and RMSE for a dataset.')
    parser.add_argument('--data_path', type=str, required=True, help='Path to the CSV dataset')
    parser.add_argument('--models_dir', type=str, default='models', help='Path to the models directory')
    args = parser.parse_args()

    # Paths
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    models_dir = os.path.join(base_dir, args.models_dir)
    model_path = os.path.join(models_dir, 'model.pkl')
    encoder_path = os.path.join(models_dir, 'encoder.pkl')

    print(f"Loading model from {model_path}...")
    try:
        model = joblib.load(model_path)
        encoder = joblib.load(encoder_path)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return

    print(f"Loading data from {args.data_path}...")
    try:
        df = pd.read_csv(args.data_path, sep=';')
    except Exception as e:
        print(f"Error reading CSV: {e}")
        # Try comma separator
        try:
            df = pd.read_csv(args.data_path, sep=',')
        except:
            return

    # Preprocessing (Identical to notebook)
    print("Preprocessing data...")
    
    # Clean Price
    df['Price'] = df['Price'].apply(clean_price)
    df = df.dropna(subset=['Price'])
    
    # Feature Engineering
    for col in ['m² (Gross)', 'm² (Net)']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    df['Rooms_Num'] = df['Number of rooms'].apply(clean_rooms)
    df['Age_Num'] = df['Building Age'].apply(clean_age)
    df['Room_Size_Ratio'] = df['m² (Net)'] / df['Rooms_Num'].replace(0, 1)
    df['Balcony_Bool'] = df['Balcony'].apply(clean_balcony)

    for col in ['Number of bathrooms', 'Number of floors']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # Select columns
    keep_cols = [
        'Price', 'District', 'Neighborhood', 
        'm² (Net)', 'Rooms_Num', 'Age_Num', 'Room_Size_Ratio',
        'Floor location', 'Heating', 'Number of bathrooms', 'Number of floors',
        'Balcony_Bool', 'Elevator', 'Parking Lot', 'Security'
    ]
    
    # Ensure all columns exist
    missing_cols = [c for c in keep_cols if c not in df.columns]
    if missing_cols:
        print(f"Warning: Missing columns in dataset: {missing_cols}")
        for c in missing_cols:
            df[c] = 0 # Dummy fill
            
    df_model = df[keep_cols].copy()

    # Fill NaNs
    binary_cols = ['Balcony_Bool', 'Elevator', 'Parking Lot', 'Security']
    for col in binary_cols:
        if col in df_model.columns:
            df_model[col] = pd.to_numeric(df_model[col], errors='coerce').fillna(0)

    num_cols = ['m² (Net)', 'Rooms_Num', 'Age_Num', 'Room_Size_Ratio', 'Number of bathrooms', 'Number of floors']
    for col in num_cols:
        if col in df_model.columns:
            df_model[col] = df_model[col].fillna(df_model[col].median())

    cat_cols = ['District', 'Neighborhood', 'Floor location', 'Heating']
    for col in cat_cols:
        if col in df_model.columns:
            df_model[col] = df_model[col].fillna("Unknown")

    # Outlier Removal (Match Notebook)
    lower_bound = df_model['Price'].quantile(0.01)
    upper_bound = df_model['Price'].quantile(0.99)
    print(f"Applying outlier filter (1%-99%): {lower_bound:,.0f} TL - {upper_bound:,.0f} TL")
    
    initial_len = len(df_model)
    df_model = df_model[(df_model['Price'] >= lower_bound) & (df_model['Price'] <= upper_bound)]
    print(f"Dropped {initial_len - len(df_model)} outliers. Remaining: {len(df_model)}")

    # X, y split
    y_true = df_model['Price']
    X = df_model.drop(columns=['Price'])

    # Transform
    print("Predicting...")
    try:
        X_enc = encoder.transform(X)
        y_pred = model.predict(X_enc)
    except Exception as e:
        print(f"Prediction error: {e}")
        return

    # Metrics
    r2 = r2_score(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))

    print("="*30)
    print(f"R² Score: {r2:.4f}")
    print(f"RMSE:     {rmse:,.0f}")
    print("="*30)

if __name__ == "__main__":
    main()
