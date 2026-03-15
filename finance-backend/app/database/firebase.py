import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
import os
import json

# Initialize Firebase on module load
if not firebase_admin._apps:
    try:
        # 1. Try explicit service account file
        if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            print("Successfully initialized Firebase Admin SDK with credentials file.")
        # 2. Try JSON string from environment variable (useful for some CI/CD)
        elif os.getenv("FIREBASE_CREDENTIALS_JSON"):
            cred_json = json.loads(os.getenv("FIREBASE_CREDENTIALS_JSON"))
            cred = credentials.Certificate(cred_json)
            firebase_admin.initialize_app(cred)
            print("Successfully initialized Firebase Admin SDK with credentials JSON from environment.")
        # 3. Fallback to Application Default Credentials (standard for Google Cloud/Firebase Functions)
        else:
            print("Attempting to initialize with Application Default Credentials.")
            firebase_admin.initialize_app()
            print("Successfully initialized with Default Credentials.")
    except Exception as e:
        print(f"Failed to initialize Firebase: {e}")

# Provide a dependency for FastAPI routers
def get_db():
    try:
        db = firestore.client()
        yield db
    except Exception as e:
        print(f"Could not connect to Firestore: {e}")
        yield None
