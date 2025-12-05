const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// GET all employees
app.get('/api/employees', asyncHandler(async (req, res) => {
  const { department } = req.query;
  
  let query = 'SELECT * FROM employees';
  let params = [];
  
  if (department) {
    query += ' WHERE department = ?';
    params.push(department);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ employees: rows });
  });
}));

// GET single employee by ID
app.get('/api/employees/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ employee: row });
  });
}));

// POST create new employee
app.post('/api/employees', asyncHandler(async (req, res) => {
  const { name, email, department, role, hireDate } = req.body;
  
  // Validation
  if (!name || !email || !department || !role || !hireDate) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  
  const query = `
    INSERT INTO employees (name, email, department, role, hireDate)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [name, email, department, role, hireDate], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: this.lastID,
        name,
        email,
        department,
        role,
        hireDate
      }
    });
  });
}));

// PUT update employee
app.put('/api/employees/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, department, role, hireDate } = req.body;
  
  // Validation
  if (!name || !email || !department || !role || !hireDate) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  
  const query = `
    UPDATE employees
    SET name = ?, email = ?, department = ?, role = ?, hireDate = ?
    WHERE id = ?
  `;
  
  db.run(query, [name, email, department, role, hireDate, id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({
      message: 'Employee updated successfully',
      employee: { id, name, email, department, role, hireDate }
    });
  });
}));

// DELETE employee
app.delete('/api/employees/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted successfully' });
  });
}));

// GET all unique departments
app.get('/api/departments', asyncHandler(async (req, res) => {
  db.all('SELECT DISTINCT department FROM employees ORDER BY department', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const departments = rows.map(row => row.department);
    res.json({ departments });
  });
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
