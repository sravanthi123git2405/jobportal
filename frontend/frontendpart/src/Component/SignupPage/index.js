import { Component } from 'react';
import { Navigate,Link } from 'react-router-dom';
import './index.css';

class SignupPage extends Component {
  state = {
    name: '',
    username: '',
    password: '',
    loading: false,
    showError: false,
    errorMsg: '',
    redirectToLogin: false,
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, showError: false });
    const { name, username, password } = this.state;

    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, username, password }),
      });

      const data = await response.json();

      if (response.ok) this.setState({ redirectToLogin: true });
      else this.setState({ showError: true, errorMsg: data.error_msg || 'Signup failed' });
    } catch {
      this.setState({ showError: true, errorMsg: 'Something went wrong' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { name, username, password, loading, showError, errorMsg, redirectToLogin } = this.state;

    if (redirectToLogin) return <Navigate to="/login" replace />;

    return (
      <div className="auth-container">
        <div className="auth-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form-control" onSubmit={this.handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
              required
            />
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
              {loading ? 'Signing up...' : 'Signup'}
            </button>
            {showError && <p className="error-msg">{errorMsg}</p>}
          </form> 
           <p>Already have a account ? <Link to="/login">Login</Link></p>
        </div>
      </div>
    );
  }
}

export default SignupPage;