import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const { email, password } = formData;

    // Validation
    if (!email || !password) {
      setTouched({ email: true, password: true });
      return;
    }

    if (!isEmailValid(email)) {
      setTouched((prev) => ({ ...prev, email: true }));
      return;
    }

    if (password.length < 6) {
      setTouched((prev) => ({ ...prev, password: true }));
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`${apiUrl}/user/login`, formData);

      if (response.status === 200) {
        const body = response.data;

        if (body.message === 'Invalid Credentials') {
          setErrorMessage('Invalid email or password');
        } else {
          const user = body.userInformation;
          // Save token and lightweight user details
          localStorage.setItem('token', body.token);
          localStorage.setItem(
            'userData',
            JSON.stringify({
              role: user.role,
              userId: user._id,
              userName: `${user.firstName} ${user.lastName}`,
            })
          );

          // Role-based redirects for recipe app
          if (user.role === 'Chef') {
            navigate('/manage-recipes');    // Chef dashboard to add/manage recipes
          } else {
            navigate('/recipe-catalog');    // Foodie browsing / saving recipes
          }
        }
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      navigate('/error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-box">
            <h2>Login to Cookistry</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && (
                  <div className="error">
                    {!formData.email && <div>Email is required</div>}
                    {formData.email && !isEmailValid(formData.email) && (
                      <div>Invalid email address</div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  minLength="6"
                />
                {touched.password && (
                  <div className="error">
                    {!formData.password && <div>Password is required</div>}
                    {formData.password && formData.password.length < 6 && (
                      <div>Password must be at least 6 characters</div>
                    )}
                  </div>
                )}
              </div>

              {errorMessage && <div className="error">{errorMessage}</div>}

              <button type="submit" className="login-button" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Login'}
              </button>
            </form>

            <div className="signup-link">
              Don't have an account? <a href="/register">Signup</a>
            </div>
          </div>
        </div>

        <div className="login-right">
          <h1>Cookistry</h1>
          <h2>Share. Discover. Savor.</h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
