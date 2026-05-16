import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { api } from '../../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function AuthPage() {

  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  // ✅ HANDLE INPUT
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ✅ LOGIN / REGISTER
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      let data;

      // LOGIN
      if (mode === 'login') {

        data = await api.login({
          email: form.email,
          password: form.password
        });

      }

      // REGISTER
      else {

        data = await api.register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address
        });

      }

      // SAVE USER
      login(data.token, data);

      // ROLE BASED NAVIGATION
      if (data.role === 'ADMIN') {

        navigate('/admin');

      }

      else if (
        data.role === 'RESTAURANT_OWNER'
      ) {

        navigate('/owner');

      }

      else {

        navigate('/');

      }

    }

    catch (err) {

      setError(
        err.message ||
        'Something went wrong. Please try again.'
      );

    }

    finally {

      setLoading(false);

    }
  };

  // ✅ GOOGLE LOGIN
  const handleGoogleSuccess = (
    credentialResponse
  ) => {

    try {

      const googleUser = jwtDecode(
        credentialResponse.credential
      );

      console.log(
        'Google User:',
        googleUser
      );

      // TEMP USER OBJECT
      const userData = {
        token: credentialResponse.credential,
        name: googleUser.name,
        email: googleUser.email,
        role: 'USER'
      };

      // SAVE USER
      localStorage.setItem(
        'fd_user',
        JSON.stringify(userData)
      );

      localStorage.setItem(
        'fd_token',
        credentialResponse.credential
      );

      // OPTIONAL CONTEXT LOGIN
      if (login) {
        login(
          credentialResponse.credential,
          userData
        );
      }

      navigate('/');

    }

    catch (err) {

      console.error(err);

      setError(
        'Google login failed'
      );

    }
  };

  return (

    <div style={styles.wrapper}>

      <div style={styles.card}>

        {/* LOGO */}
        <div style={styles.logo}>
          🍽 FoodRush
        </div>

        {/* TITLE */}
        <h2 style={styles.title}>

          {
            mode === 'login'
              ? 'Welcome back'
              : 'Create account'
          }

        </h2>

        {/* SUBTITLE */}
        <p style={styles.subtitle}>

          {
            mode === 'login'
              ? 'Sign in to order your favourite food'
              : 'Join us and start ordering today'
          }

        </p>

        {/* ERROR */}
        {
          error &&
          <div style={styles.error}>
            {error}
          </div>
        }

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          {/* NAME */}
          {
            mode === 'register' && (

              <div style={styles.field}>

                <label style={styles.label}>
                  Full name
                </label>

                <input
                  style={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

            )
          }

          {/* EMAIL */}
          <div style={styles.field}>

            <label style={styles.label}>
              Email
            </label>

            <input
              style={styles.input}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* PASSWORD */}
          <div style={styles.field}>

            <label style={styles.label}>
              Password
            </label>

            <input
              style={styles.input}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />

          </div>

          {/* PHONE + ADDRESS */}
          {
            mode === 'register' && (

              <>

                <div style={styles.field}>

                  <label style={styles.label}>
                    Phone
                  </label>

                  <input
                    style={styles.input}
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div style={styles.field}>

                  <label style={styles.label}>
                    Address
                  </label>

                  <input
                    style={styles.input}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />

                </div>

              </>

            )
          }

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >

            {
              loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create account'
            }

          </button>

        </form>

        {/* GOOGLE LOGIN */}
        <div style={{ marginTop: '20px' }}>

          <GoogleLogin

            onSuccess={
              handleGoogleSuccess
            }

            onError={() => {

              console.log(
                'Google Login Failed'
              );

              setError(
                'Google login failed'
              );

            }}

          />

        </div>

        {/* TOGGLE */}
        <p style={styles.toggle}>

          {
            mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'
          }

          {' '}

          <button
            style={styles.linkBtn}
            onClick={() => {

              setMode(
                mode === 'login'
                  ? 'register'
                  : 'login'
              );

              setError('');

            }}
          >

            {
              mode === 'login'
                ? 'Sign up'
                : 'Sign in'
            }

          </button>

        </p>

      </div>

    </div>

  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F9F7F4'
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: 12,
    width: 350
  },
  logo: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
  title: {
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777'
  },
  error: {
    background: '#fdd',
    padding: 10,
    marginBottom: 10
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  field: {
    marginBottom: 10
  },
  label: {
    fontSize: 12
  },
  input: {
    padding: 8,
    width: '100%'
  },
  btn: {
    padding: 10,
    background: '#D85A30',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  toggle: {
    textAlign: 'center',
    marginTop: 10
  },
  linkBtn: {
    border: 'none',
    background: 'none',
    color: '#D85A30',
    cursor: 'pointer'
  }
};