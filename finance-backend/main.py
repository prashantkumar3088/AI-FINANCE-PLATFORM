from firebase_functions import https_fn
from app.main import app

@https_fn.on_request(
    cors=True,
    region="us-central1" # Matches firestore location in firebase.json
)
def api(req: https_fn.Request) -> https_fn.Response:
    # This handles the FastAPI app routing automatically
    return https_fn.handle_http_request(app, req)
