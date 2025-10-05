import { Component } from 'react'
import Cookies from 'js-cookie'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { BsFillBriefcaseFill } from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import { withRouter } from '../withRouter'

const apistatusconstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobdetails: {},
    similarJobs: [],
    apistatus: apistatusconstants.initial,
    isApplied: false,
  }

  componentDidMount() {
    this.getjobitemdetails()
  }

  getjobitemdetails = async () => {
    this.setState({ apistatus: apistatusconstants.progress })
    const { id } = this.props.params
    const jwtToken = Cookies.get('token')
    const apiurl = `http://localhost:5000/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiurl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJob = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      // ✅ check applied for current user only
      const username = Cookies.get('username')
      const appliedJobs =
        JSON.parse(localStorage.getItem(`appliedJobs_${username}`)) || []
      const alreadyApplied = appliedJobs.some(job => job.id === updatedJob.id)

      this.setState({
        jobdetails: updatedJob,
        similarJobs: data.similar_jobs,
        apistatus: apistatusconstants.success,
        isApplied: alreadyApplied,
      })
    } else {
      this.setState({ apistatus: apistatusconstants.failure })
    }
  }

  // ✅ Apply handler
  handleApply = () => {
    const { jobdetails } = this.state
    const username = Cookies.get('username')
    let appliedJobs =
      JSON.parse(localStorage.getItem(`appliedJobs_${username}`)) || []

    if (!appliedJobs.some(job => job.id === jobdetails.id)) {
      appliedJobs.push(jobdetails)
      localStorage.setItem(
        `appliedJobs_${username}`,
        JSON.stringify(appliedJobs)
      )
    }

    this.setState({ isApplied: true })
  }

  renderloading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderfailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="btn-retry" onClick={this.getjobitemdetails}>
        Retry
      </button>
    </div>
  )

  rendersuccess = () => {
    const { jobdetails, similarJobs, isApplied } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobdetails

    return (
      <>
        <Header />
        <div className="job-item-details-container">
          <div className="job-header">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <p className="rating">
                <FaStar className="star-icon" /> {rating}
              </p>
            </div>
          </div>

          <div className="job-meta">
            <div className="meta-item">
              <FaMapMarkerAlt className="meta-icon" />
              <p>{location}</p>
            </div>
            <div className="meta-item">
              <BsFillBriefcaseFill className="meta-icon" />
              <p>{employmentType}</p>
            </div>
            <p className="salary">{packagePerAnnum}</p>
          </div>

          <h2>Description</h2>
          <p>{jobDescription}</p>
          <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
            Visit Company
          </a>

          <div className="apply-section">
            <button
              className={`apply-btn ${isApplied ? 'applied' : ''}`}
              onClick={this.handleApply}
              disabled={isApplied}
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>

          <h2>Skills</h2>
          <ul className="skills-list">
            {skills.map(each => (
              <li key={each.name} className="skill-item">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-img"
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>

          <h2>Life at Company</h2>
          <div className="life-container">
            <p>{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-img"
            />
          </div>

          <h2>Similar Jobs</h2>
          <ul className="similar-list">
            {similarJobs.map(each => (
              <li key={each.id} className="similar-card">
                <img src={each.company_logo_url} alt="company logo" />
                <h3>{each.title}</h3>
                <p>{each.job_description}</p>
                <p>
                  {each.location} • {each.employment_type}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  render() {
    const { apistatus } = this.state
    switch (apistatus) {
      case apistatusconstants.progress:
        return this.renderloading()
      case apistatusconstants.success:
        return this.rendersuccess()
      case apistatusconstants.failure:
        return this.renderfailure()
      default:
        return null
    }
  }
}

export default withRouter(JobItemDetails)