# 📝 Blog Application – Module 04: CRUD Operations

A simple blog application with full **CRUD** functionality, plus **search** and **category filters**.

## Features
- **Create** a blog (title, author, category, content) with validation
- **Read** all blogs and a single blog page
- **Update** an existing blog
- **Delete** a blog (with confirmation)
- **Search** blogs by title, content or author
- **Filter** blogs by category

## Tech Stack
Node.js · Express · EJS · JSON file storage

## Run Locally
```bash
git clone <your-repo-url>
cd blog-crud-app
npm install
npm start
```
Open http://localhost:3000

## Routes
| Method | Route | Action |
|---|---|---|
| GET | `/blogs` | List blogs (`?q=` search, `?category=` filter) |
| GET | `/blogs/new` | New blog form |
| POST | `/blogs` | Create blog |
| GET | `/blogs/:id` | View blog |
| GET | `/blogs/:id/edit` | Edit form |
| POST | `/blogs/:id/update` | Update blog |
| POST | `/blogs/:id/delete` | Delete blog |

## Project Structure
```
├── server.js
├── data/blogs.json
├── views/ (index, show, form, 404, partials)
└── public/style.css
```
