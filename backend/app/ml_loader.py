from pathlib import Path
import joblib

MODEL_PATH = Path(__file__).parent / "ml" / "model_bundle.pkl"

try:
    ml_bundle = joblib.load(MODEL_PATH)
except FileNotFoundError:
    ml_bundle = None
    print(f"[WARNING] ML model not found at {MODEL_PATH}. "
          f"/prediction/predict will not work until it's added.")
