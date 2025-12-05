# Employee Management System

An enterprise employee management system with CRUD operations built with Node.js, Express, SQLite, and React.

## Features

- ✅ Create, Read, Update, Delete (CRUD) employee records
- ✅ Employee fields: ID, Name, Email, Department, Role, Hire Date
- ✅ Search employees by name, email, department, or role
- ✅ Filter employees by department
- ✅ RESTful API design
- ✅ Clean, maintainable code with proper error handling
- ✅ Responsive UI design

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3
- CORS & Body-Parser

### Frontend
- React
- CSS3

## Project Structure

```
aj-management-app/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── database.js        # SQLite database setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Styling
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees?department=IT` | Get employees by department |
| GET | `/api/employees/:id` | Get single employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all unique departments |

## API Request/Response Examples

### Create Employee (POST /api/employees)

Request Body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "department": "IT",
  "role": "Software Engineer",
  "hireDate": "2024-01-15"
}
```

Response:
```json
{
  "message": "Employee created successfully",
  "employee": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "IT",
    "role": "Software Engineer",
    "hireDate": "2024-01-15"
  }
}
```

### Get All Employees (GET /api/employees)

Response:
```json
{
  "employees": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "department": "IT",
      "role": "Software Engineer",
      "hireDate": "2024-01-15"
    }
  ]
}
```

## Usage

1. Start both backend and frontend servers
2. Open your browser to `http://localhost:3000`
3. Use the interface to:
   - Add new employees using the "Add Employee" button
   - Search for employees using the search bar
   - Filter employees by department using the dropdown
   - Edit employee information by clicking "Edit"
   - Delete employees by clicking "Delete"

## Features in Detail

### CRUD Operations
- **Create**: Add new employees with all required fields
- **Read**: View all employees in a table format
- **Update**: Edit existing employee information
- **Delete**: Remove employees from the system

### Search & Filter
- **Search**: Real-time search across name, email, department, and role
- **Filter**: Filter employees by specific department

### Error Handling
- Form validation for all required fields
- Email uniqueness validation
- Proper error messages for failed operations
- Success notifications for completed actions

## Database Schema

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  hireDate TEXT NOT NULL
);
```

## Future Enhancements

- User authentication and authorization
- Employee photo upload
- Export employee data to CSV/PDF
- Advanced filtering and sorting options
- Pagination for large datasets
- Employee performance tracking
- Department management interface

## License

This project is open source and available under the MIT License.

