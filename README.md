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
- **Database connection failed:** Check MySQL is running and update `config/database.php`.
- **404 / API not found:** Confirm the folder is inside the WAMP `www` directory and use the correct folder name in the browser.
- **Blank or failed API response:** Check Apache/PHP error logs and confirm PDO MySQL is enabled.
- **Tasks do not persist:** Ensure `database.sql` was imported successfully and the API is being served by PHP.

## Project flow
Browser UI → JavaScript Fetch API → PHP REST endpoint → MySQL database → JSON response → UI refresh.
