import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validation regexes
  const mobileRegex = /^\d{10}$/; // exactly 10 digits
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email check

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobileNumber') {
      // Keep only digits and cap to 10 (mirror backend)
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const requiredFields = ['firstName', 'lastName', 'mobileNumber', 'email', 'password', 'confirmPassword', 'role'];

  // Helpers for errors
  const isEmptyAndTouched = (field) => !formData[field] && touched[field];

  const isMobileValid = () => mobileRegex.test(formData.mobileNumber);
  const mobileErrorMessage = () => {
    if (!touched.mobileNumber) return '';
    if (!formData.mobileNumber) return 'Mobile Number is required';
    if (!/^\d+$/.test(formData.mobileNumber)) return 'Mobile must contain only digits';
    if (formData.mobileNumber.length !== 10) return 'Mobile number must be exactly 10 digits';
    return '';
  };

  const isEmailValid = () => emailRegex.test(formData.email);
  const emailErrorMessage = () => {
    if (!touched.email) return '';
    if (!formData.email) return 'Email is required';
    if (!isEmailValid()) return 'Please enter a valid email address';
    return '';
  };

  const passwordErrorMessage = () => {
    if (!touched.password) return '';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const confirmPasswordErrorMessage = () => {
    if (!touched.confirmPassword) return '';
    if (!formData.confirmPassword) return 'Confirm Password is required';
    if (formData.password && formData.confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // mark all required touched so errors show after first click
    setTouched((prev) => {
      const newTouched = { ...prev };
      requiredFields.forEach((f) => (newTouched[f] = true));
      return newTouched;
    });

    // Basic required check
    const hasEmpty = requiredFields.some((field) => !formData[field]);
    if (hasEmpty) return;

    // Password checks
    if (formData.password.length < 6) {
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // Email + Mobile checks
    if (!isEmailValid() || !isMobileValid()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`${apiUrl}/user/signup`, formData);

      if (response.status === 200 || response.status === 201) {
        setShowSuccessPopup(true);
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Something went wrong while registering. Redirecting to error page.');
        navigate('/error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const closePopupAndRedirect = () => {
    setShowSuccessPopup(false);
    navigate('/login');
  };

  // Only disable while submitting; allow clicking Register so required messages show
  const disableSubmit = submitting;

  return (
    <>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-box">
              <h2>Register for Cookistry</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={isEmptyAndTouched('firstName')}
                    autoComplete="given-name"
                  />
                  {isEmptyAndTouched('firstName') && <div className="error">First Name is required</div>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={isEmptyAndTouched('lastName')}
                    autoComplete="family-name"
                  />
                  {isEmptyAndTouched('lastName') && <div className="error">Last Name is required</div>}
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number (10 digits)"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    autoComplete="tel"
                    aria-invalid={!!mobileErrorMessage()}
                  />
                  {mobileErrorMessage() && <div className="error">{mobileErrorMessage()}</div>}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!emailErrorMessage()}
                    autoComplete="email"
                  />
                  {emailErrorMessage() && <div className="error">{emailErrorMessage()}</div>}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    minLength={6}
                    aria-invalid={!!passwordErrorMessage()}
                    autoComplete="new-password"
                  />
                  {passwordErrorMessage() && <div className="error">{passwordErrorMessage()}</div>}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!confirmPasswordErrorMessage()}
                    autoComplete="new-password"
                  />
                  {confirmPasswordErrorMessage() && <div className="error">{confirmPasswordErrorMessage()}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="role">Select Role:</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={isEmptyAndTouched('role')}
                  >
                    <option value="">-- Select --</option>
                    <option value="Chef">Chef</option>
                    <option value="Foodie">Foodie</option>
                  </select>
                  {isEmptyAndTouched('role') && <div className="error">Role is required</div>}
                </div>

                {serverError && <div className="error" style={{ marginBottom: 12 }}>{serverError}</div>}

                <button type="submit" className="login-button" disabled={disableSubmit}>
                  {submitting ? 'Registering...' : 'Register'}
                </button>
              </form>

              <div className="signup-link">
                Already have an account? <a href="/login">Login</a>
              </div>
            </div>
          </div>

          <div className="login-right">
            <h1>Cookistry</h1>
            <h2>Share. Discover. Savor.</h2>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Registration Successful</h3>
            <p>You can now log in and start learning or mentoring!</p>
            <button onClick={closePopupAndRedirect}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
