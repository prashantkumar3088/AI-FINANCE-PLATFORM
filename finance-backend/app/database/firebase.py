import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
import os
import json

# Initialize Firebase on module load
if not firebase_admin._apps:
    try:
        # In actual production or local run, you'd mount the JSON file here.
        if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            print("Successfully initialized Firebase Admin SDK with credentials file.")
        else:
            # Fallback to application default credentials if json is missing
            print(f"Credentials file {settings.FIREBASE_CREDENTIALS_PATH} not found. Attempting default auth.")
            # We mock the initialization if we don't have it purely so FastAPI can start and we can see schema shapes
            # In a real environment, Application Default Credentials would be picked up.
            try:
                firebase_admin.initialize_app()
            except ValueError:
                print("Could not initialize with default credentials either. Service will crash on DB access.")
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
