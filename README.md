# TaskFlow — REST API Based To-Do Application

A responsive full-stack task manager built with HTML, CSS, JavaScript Fetch API, PHP (REST API), and MySQL. No frontend framework or Composer package is required.

## Features
- Responsive desktop and mobile layout
- Create tasks with an optional description
- List tasks from MySQL through a REST API
- Mark tasks active/completed
- Delete a task or clear all completed tasks
- Filter by All, Active, and Completed
- Progress bar and task statistics
- Input validation, prepared SQL statements, and user-friendly errors

## Requirements
- WAMP Server (or another PHP + MySQL environment)
- PHP with PDO MySQL enabled
- MySQL / MariaDB

## Setup on WAMP
1. Extract the `rest_api_todo_app` folder into `C:\wamp64\www\`.
2. Start WAMP and make sure Apache and MySQL are running.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Import `database.sql` using the **Import** tab.
5. Open `config/database.php` and confirm the MySQL username/password. The sample uses `root` with a blank password, which may not match your setup.
6. Open `http://localhost/rest_api_todo_app/` in your browser. Do not open `index.html` directly from the file manager; PHP API requests need the server.

## REST API endpoints
Base URL: `/rest_api_todo_app/api/tasks.php`

| Method | Endpoint | Purpose | Body |
|---|---|---|---|
| GET | `api/tasks.php` | Get all tasks | None |
| POST | `api/tasks.php` | Create task | `{"title":"Study PHP","description":"Revise REST APIs"}` |
| PATCH | `api/tasks.php?id=1` | Update completion | `{"completed":1}` |
| DELETE | `api/tasks.php?id=1` | Delete task | None |

All responses are JSON. Typical status codes include `200`, `201`, `400`, `404`, `405`, and `422`.

## Troubleshooting
- **Database connection failed:** Check MySQL is running and update `config/database.php`.
- **404 / API not found:** Confirm the folder is inside the WAMP `www` directory and use the correct folder name in the browser.
- **Blank or failed API response:** Check Apache/PHP error logs and confirm PDO MySQL is enabled.
- **Tasks do not persist:** Ensure `database.sql` was imported successfully and the API is being served by PHP.

## Project flow
Browser UI → JavaScript Fetch API → PHP REST endpoint → MySQL database → JSON response → UI refresh.
