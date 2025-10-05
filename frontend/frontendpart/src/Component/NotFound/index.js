import './index.css'

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="failure-card">
        <img
          src="ttps://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
          className="image"
        />
        <h1 className="head">Page Not Found</h1>
        <p className="para">
          We are sorry,the page you requested could not be found
        </p>
      </div>
    </div>
  )
}

export default NotFound
