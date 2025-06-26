import React, { useState } from 'react';

function UserManager() {
  // State for user list
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' }
  ]);

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User'
  });

  // State for editing mode
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Submit form - either add new user or update existing
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      // Update existing user
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === currentId ? { ...user, ...formData } : user
        )
      );
      setEditMode(false);
      setCurrentId(null);
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...formData
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      role: 'User'
    });
  };

  // Set up form for editing
  const startEdit = (user) => {
    setEditMode(true);
    setCurrentId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  // Delete a user
  const deleteUser = (id) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      name: '',
      email: '',
      role: 'User'
    });
  };

  return (
    <div className="user-manager">
      <h2>User Manager (useState with Form Objects)</h2>
      
      {/* User Form */}
      <form onSubmit={handleSubmit} className="user-form">
        <h3>{editMode ? 'Edit User' : 'Add New User'}</h3>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="User">User</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        
        <div className="form-buttons">
          <button type="submit">{editMode ? 'Update User' : 'Add User'}</button>
          {editMode && (
            <button type="button" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>
      
      {/* User List */}
      <div className="user-list">
        <h3>Users ({users.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => startEdit(user)}>Edit</button>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManager; 