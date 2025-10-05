import {Link} from 'react-router-dom'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItems = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = job

  return (
    <Link to={`/jobs/${id}`}>
      <li className="card-list">
        <div className="logo-head-title">
          <img src={companyLogoUrl} alt="company logo" className="image-logo" />
          <div className="heading-card">
            <h1 className="title">{title}</h1>
            <div className="rating-card">
              <BsFillStarFill className="star" />
              <p className="title">{rating}</p>
            </div>
          </div>
        </div>

        <div className="second-card">
          <div className="insdide-second">
            <div className="location-category">
              <FaMapMarkerAlt className="location-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="location-category">
              <BsFillBriefcaseFill className="case-icon" />
              <p className="location">{employmentType}</p>
            </div>
          </div>
          <div className="lpa-card">
            <p className="title">{packagePerAnnum}</p>
          </div>
        </div>

        <hr className="horione" />
        <h1 className="description-head">Description</h1>
        <p className="description-card">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItems