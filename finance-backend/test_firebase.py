import firebase_admin
from firebase_admin import credentials, firestore
import os

def test_full_flow():
    try:
        if os.path.exists("serviceAccountKey.json"):
            if not firebase_admin._apps:
                cred = credentials.Certificate("serviceAccountKey.json")
                firebase_admin.initialize_app(cred)
            
            db = firestore.client()
            print("SUCCESS: Connected to Firestore!")
            
            # Test Write
            print("Testing Write...")
            doc_ref = db.collection('test_connection').document('ping')
            doc_ref.set({'status': 'online', 'timestamp': firestore.SERVER_TIMESTAMP})
            print("SUCCESS: Write operation complete.")
            
            # Test Read
            print("Testing Read...")
            doc = doc_ref.get()
            if doc.exists:
                print(f"SUCCESS: Read document data: {doc.to_dict()}")
            
            # Test Delete
            print("Testing Delete...")
            doc_ref.delete()
            print("SUCCESS: Delete operation complete.")
            
            print("\n--- DATABASE IS FULLY FUNCTIONAL ---")
        else:
            print("ERROR: serviceAccountKey.json not found.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_full_flow()
