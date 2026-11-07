const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data', 'blogs.json');
const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Education', 'Other'];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const load = () => {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
};
const save = (blogs) => fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));

const validate = (b) => {
  const errors = [];
  if (!b.title || !b.title.trim()) errors.push('Title is required.');
  if (!b.author || !b.author.trim()) errors.push('Author is required.');
  if (!b.content || !b.content.trim()) errors.push('Content is required.');
  if (!CATEGORIES.includes(b.category)) errors.push('Please choose a valid category.');
  return errors;
};
const clean = (b) => ({
  title: b.title.trim(), author: b.author.trim(),
  category: b.category, content: b.content.trim(),
});

// READ (list + search + category filter)
app.get('/', (req, res) => res.redirect('/blogs'));
app.get('/blogs', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  const category = req.query.category || '';
  let blogs = load();
  if (q) blogs = blogs.filter(b => (b.title + ' ' + b.content + ' ' + b.author).toLowerCase().includes(q));
  if (category) blogs = blogs.filter(b => b.category === category);
  blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.render('index', { blogs, q: req.query.q || '', category, CATEGORIES });
});

// CREATE
app.get('/blogs/new', (req, res) =>
  res.render('form', { blog: {}, errors: [], CATEGORIES, action: '/blogs', heading: 'New Blog' }));
app.post('/blogs', (req, res) => {
  const errors = validate(req.body);
  if (errors.length)
    return res.status(400).render('form', { blog: req.body, errors, CATEGORIES, action: '/blogs', heading: 'New Blog' });
  const blogs = load();
  const now = new Date().toISOString();
  const blog = { id: Date.now().toString(), ...clean(req.body), createdAt: now, updatedAt: now };
  blogs.push(blog);
  save(blogs);
  res.redirect('/blogs/' + blog.id);
});

// READ (single)
app.get('/blogs/:id', (req, res) => {
  const blog = load().find(b => b.id === req.params.id);
  if (!blog) return res.status(404).render('404');
  res.render('show', { blog });
});

// UPDATE
app.get('/blogs/:id/edit', (req, res) => {
  const blog = load().find(b => b.id === req.params.id);
  if (!blog) return res.status(404).render('404');
  res.render('form', { blog, errors: [], CATEGORIES, action: `/blogs/${blog.id}/update`, heading: 'Edit Blog' });
});
app.post('/blogs/:id/update', (req, res) => {
  const blogs = load();
  const i = blogs.findIndex(b => b.id === req.params.id);
  if (i === -1) return res.status(404).render('404');
  const errors = validate(req.body);
  if (errors.length)
    return res.status(400).render('form', { blog: { ...req.body, id: req.params.id }, errors, CATEGORIES,
      action: `/blogs/${req.params.id}/update`, heading: 'Edit Blog' });
  blogs[i] = { ...blogs[i], ...clean(req.body), updatedAt: new Date().toISOString() };
  save(blogs);
  res.redirect('/blogs/' + req.params.id);
});

// DELETE
app.post('/blogs/:id/delete', (req, res) => {
  save(load().filter(b => b.id !== req.params.id));
  res.redirect('/blogs');
});

app.use((req, res) => res.status(404).render('404'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Blog app running at http://localhost:${PORT}`));
