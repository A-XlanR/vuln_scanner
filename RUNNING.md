# How to Run CyberSentinel

This guide explains how to start both the Backend (API) and Frontend (UI) servers.

## Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Git**

## 1. Start the Backend (API)
The backend runs on port `8000`.

1.  Open a terminal.
2.  Navigate to the project root:
    ```powershell
    cd c:\Users\lanx4\Documents\polytechnics\dbms\cybersentinel
    ```
3.  (Optional) Activate virtual environment if you have one.
4.  Run the server:
    ```powershell
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
    ```
5.  Verify it's running by opening: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 2. Start the Frontend (UI)
The frontend runs on port `5173`.

1.  Open a **new** terminal (keep the backend running).
2.  Navigate to the project root.
3.  Run the development server:
    ```powershell
    npm run dev
    ```
4.  Open the link shown in the terminal, usually: [http://localhost:5173](http://localhost:5173)

---

## Database Management
The application uses a **SQLite** database stored in a file named `sql_app.db` in the project root.

### How to Check Data
- **Via API**: Go to the [Swagger UI](http://127.0.0.1:8000/docs) and use the `GET /api/v1/scans/` or `GET /api/v1/users/` endpoints.
- **Via Tool**: Download [DB Browser for SQLite](https://sqlitebrowser.org/) and open the `sql_app.db` file to view the tables directly.
- **VS Code**: Install the "SQLite" extension to view the database directly in your editor.

### How to Clear Data
The database **is not** automatically cleared. It persists your users and scans.

**To clear everything (reset):**
1.  Stop the backend server (Ctrl+C).
2.  Delete the `sql_app.db` file.
    ```powershell
    Remove-Item sql_app.db
    ```
3.  Restart the backend server. It will automatically recreate a fresh, empty database file.
