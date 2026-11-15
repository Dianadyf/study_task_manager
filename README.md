# My Study Task Manager

A web-based study task management application built for the INFO1012 Assessment 3
(learning task management web app). It lets a student log in, and then create, update,
delete and view study tasks (title, course code/name, due date, description, priority)
in an ordered table, with input validation and a live date/time footer.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home page: main title, navigation, image carousel (3 images + Next/Previous buttons), About This App, About Me |
| `tasks.html` | Task management page: login system, create/update/delete/view tasks, data validation, current date & time at the bottom |
| `troubleshooting.html` | Three-week sprint plan table and bug log (2 errors: screenshots, buggy code, fixed code, explanations) |
| `ethics.html` | Ethics & privacy reflection |

## Tech Stack

- HTML5
- CSS3 (`css/style.css`)
- Vanilla JavaScript (`js/shared.js`, `js/home.js`, `js/tasks.js`)
- No frameworks, no build step, no external dependencies

## How to Run

Open `index.html` in any modern browser (double-click, or use
`python -m http.server` in this folder and visit `http://localhost:8000`).

## Demo Login

Username: `student` / Password: `study123`

Tasks are stored in the browser's `localStorage` and persist between visits.
