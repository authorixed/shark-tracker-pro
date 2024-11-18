import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations'; // Ensure the path is correct

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formData },
      });
      const token = data.login.token;
      localStorage.setItem('id_token', token);
      alert('Login successful!');
      window.location.assign('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Login</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default Login;