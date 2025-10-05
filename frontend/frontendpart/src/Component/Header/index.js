import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = () => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  return (
    <nav className="navbar-container">
      <Link to="/home">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>

      <ul className="unordered-lists">
        <li>
          <Link className="home-text" to="/home">Home</Link>
        </li>
        <li>
          <Link className="home-text" to="/jobs">Jobs</Link>
        </li> 
       <li><Link to="/applied-jobs" className="home-text">Applied Jobs</Link></li> 

      </ul>

      <button className="btn-logout" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Header