import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    hireDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEmployees = async () => {
    try {
      const url = selectedDepartment 
        ? `${API_URL}/employees?department=${encodeURIComponent(selectedDepartment)}`
        : `${API_URL}/employees`;
      const response = await fetch(url);
      const data = await response.json();
      setEmployees(data.employees || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`);
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingEmployee 
        ? `${API_URL}/employees/${editingEmployee.id}`
        : `${API_URL}/employees`;
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Operation failed');
        return;
      }

      setSuccess(editingEmployee ? 'Employee updated successfully' : 'Employee created successfully');
      setIsFormOpen(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
      fetchDepartments();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      hireDate: employee.hireDate
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Delete failed');
        return;
      }

      setSuccess('Employee deleted successfully');
      fetchEmployees();
      fetchDepartments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: '',
      hireDate: ''
    });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
    resetForm();
    setError('');
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="header">
        <h1>Employee Management System</h1>
      </header>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <div className="container">
        {!isFormOpen ? (
          <>
            <div className="controls">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="department-filter"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <button
                onClick={() => setIsFormOpen(true)}
                className="btn btn-primary"
              >
                Add Employee
              </button>
            </div>

            <div className="employee-list">
              {filteredEmployees.length === 0 ? (
                <p className="no-employees">No employees found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Hire Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(employee => (
                      <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.department}</td>
                        <td>{employee.role}</td>
                        <td>{employee.hireDate}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(employee)}
                            className="btn btn-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="btn btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="form-container">
            <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role:</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hire Date:</label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
