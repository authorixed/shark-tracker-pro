import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations'; // Adjust the path to match your folder structure

const Login = () => {
  const [formState, setFormState] = useState({ username: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { ...formState } });
      localStorage.setItem('token', data.login.token); // Store the token
      window.location.assign('/dashboard'); // Redirect to dashboard or homepage
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formState.username}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formState.password}
        onChange={handleInputChange}
      />
      <button type="submit">Login</button>
      {error && <p>Error logging in!</p>}
    </form>
  );
};

export default Login;