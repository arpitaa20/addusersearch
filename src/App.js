import React, { useState, useEffect } from 'react';
import './App.css';

function AddUser() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Invalid email address';
      }
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorsFound = validate();
    setErrors(errorsFound);
    if (Object.keys(errorsFound).length > 0) return;

    fetch('/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
        'Authorization': 'Basic ' + btoa('admin:admin123')
      },
      body: JSON.stringify(formData)
    })
      .then((response) => {
        if (!response.ok) {
          
          return response.json().then((err) => { throw new Error(err.message || "Server error"); });
        }
        return response.json();
      })
      .then((data) => {
        if (data.Status === 'Success') {
          setMessage('User added successfully with ID: ' + data.userId);

          setFormData({
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
          });
          setErrors({});
        } else {
          setMessage('Error: ' + data.message);
        }
      })
      .catch((error) => {
        setMessage('Error: ' + error.message);
      });
  };

  return (
    <div className="form-container">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-field">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div className="form-field">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="form-field">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-field">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit">Add User</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

function ListUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/queryUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:admin123')
      },
      body: JSON.stringify({}) 
    })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term)
    );
  });

  return (
    <div className="list-container">
      <h2>List Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('add');

  return (
    <div className="App">
      <header>
        <button onClick={() => setPage('add')}>Add User</button>
        <button onClick={() => setPage('list')}>List Users</button>
      </header>
      <main>
        {page === 'add' && <AddUser />}
        {page === 'list' && <ListUser />}
      </main>
    </div>
  );
}

export default App;
