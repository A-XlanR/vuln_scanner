# Vulnerability Scanner Backend

A simple web-based vulnerability scanner application backend built with FastAPI.

## Setup

1.  **Clone the repository**
2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```
3.  **Activate the virtual environment:**
    *   Windows: `venv\Scripts\activate`
    *   Linux/Mac: `source venv/bin/activate`
4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

```bash
uvicorn app.main:app --reload
```

## Documentation

Once authentication and main structure are implemented, documentation will be available at:

*   Swagger UI: `http://127.0.0.1:8000/docs`
*   ReDoc: `http://127.0.0.1:8000/redoc`
