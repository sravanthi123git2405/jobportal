import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom'
import './index.css';

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    loading: false,
    showError: false,
    errorMsg: '',
    redirectToHome: false,
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, showError: false });
    const { username, password } = this.state;

    try {
      const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

    if (response.ok && data.token) {
  Cookies.set('token', data.token, { expires: 1 });
  Cookies.set('username', username, { expires: 1 }); // <-- add this
  this.setState({ redirectToHome: true });
}
 else {
        this.setState({ showError: true, errorMsg: data.error_msg || 'Login failed' });
      }
    } catch (err) {
      this.setState({ showError: true, errorMsg: 'Something went wrong' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { username, password, loading, showError, errorMsg, redirectToHome } = this.state;

    if (redirectToHome) return <Navigate to="/home" replace />;

    return (
      <div className="auth-container">
        <div className="auth-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form-control" onSubmit={this.handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => this.setState({ username: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {showError && <p className="error-msg">{errorMsg}</p>}
          </form> 
          <p>You Don't have an account ? <Link to="/signup">Signup</Link></p>
        </div>
      </div>
    );
  }
}

export default LoginPage;