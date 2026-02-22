# Jotish ReactJS Assignment

This project is a React (Vite) app implementing the required assignment flow:

1. Login Page
2. List Page
3. Details Page (with camera capture)
4. Photo Result Page

Additionally, it includes a creative extra screen:

- Salary Bar Graph page for first 10 employees.

## Credentials

- Username: `testuser`
- Password: `Test123`

## API Details

- Endpoint: `https://backend.jotish.in/backend_dev/gettabledata.php`
- Method: `POST`
- Payload:

```json
{
	"username": "test",
	"password": "123456"
}
```

## Run Locally

```bash
npm install
npm run dev
```

Then open the URL shown in terminal (typically `http://localhost:5173`).

Note: API requests use `/api/gettabledata`.
- In local dev, Vite proxy forwards this to the remote PHP endpoint.
- In Vercel production, `api/gettabledata.js` acts as a server-side proxy to avoid browser CORS.

Routing note for Vercel:
- `vercel.json` rewrites all SPA routes (like `/list`, `/chart`) to `index.html` so refresh/direct-open does not return 404.

## Production Build

```bash
npm run build
```

## Deliverables Checklist

- Functional source code (this folder)
- Screenshots of important screens:
	- Login
	- List
	- Details (camera open)
	- Photo Result
	- Bar Graph
- Screen recording showing end-to-end flow:
	- Login
	- Data load on list
	- Open details
	- Capture photo
	- View photo result
	- Open bar graph
