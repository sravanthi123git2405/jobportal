import { Component } from 'react'
import Cookies from 'js-cookie'
import { BsSearch } from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileComponent from '../ProfileComponent'
import JobItems from '../JobItems'
import './index.css'

const apistatusconstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apistatus: apistatusconstants.initial,
    employementtype: [],
    searchinput: '',
    salaryrange: '',
  }

  componentDidMount() {
    this.getjobsdata()
  }

  handleemployementtype = event => {
    const { checked, value } = event.target
    this.setState(
      prevState => {
        const updatedTypes = checked
          ? [...prevState.employementtype, value]
          : prevState.employementtype.filter(type => type !== value)
        return { employementtype: updatedTypes }
      },
      this.getjobsdata
    )
  }

  handlesalarychange = event => {
    this.setState({ salaryrange: event.target.value }, this.getjobsdata)
  }

  handlesearchinput = event => {
    this.setState({ searchinput: event.target.value })
  }

  handlesearchsubmit = event => {
    event.preventDefault()
    this.getjobsdata()
  }

  getjobsdata = async () => {
    const { employementtype, searchinput, salaryrange } = this.state
    this.setState({ apistatus: apistatusconstants.progress })
    const jwtToken = Cookies.get('token')
    const employequery = employementtype.join(',')
    const apiUrl = `http://localhost:5000/jobs?employment_type=${employequery}&minimum_package=${salaryrange}&search=${searchinput}`

    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwtToken}` },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        }))
        this.setState({
          jobsList: updatedData,
          apistatus: apistatusconstants.success,
        })
      } else {
        this.setState({ apistatus: apistatusconstants.failure })
      }
    } catch (error) {
      this.setState({ apistatus: apistatusconstants.failure })
    }
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
      <button className="btn-retry" onClick={this.getjobsdata}>
        Retry
      </button>
    </div>
  )

  rendersuccess = () => {
    const { jobsList } = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            className="no-jobs-img"
            alt="no jobs"
          />
          <h1 className="no-jobs-head">No Jobs Found</h1>
          <p className="no-jobs-para">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(each => (
          <JobItems key={each.id} job={each} />
        ))}
      </ul>
    )
  }

  renderjobs = () => {
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

  render() {
    const { employementtype, salaryrange } = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-job-container">
            <div className="left-section">
              <div className="profile-and-sidebar">
                <ProfileComponent />
                <hr className="hori" />
                <h1 className="employement-head">Type of Employment</h1>
                <form className="form-control">
                  {['FULLTIME', 'PARTTIME', 'FREELANCE', 'INTERNSHIP'].map(type => (
                    <div className="filter-option" key={type}>
                      <input
                        type="checkbox"
                        id={type}
                        value={type}
                        checked={employementtype.includes(type)}
                        onChange={this.handleemployementtype}
                      />
                      <label htmlFor={type} className='one'>
                        {type === 'FULLTIME'
                          ? 'Full Time'
                          : type === 'PARTTIME'
                          ? 'Part Time'
                          : type.charAt(0) + type.slice(1).toLowerCase()}
                      </label>
                    </div>
                  ))}
                  <hr className="hori" />

                  <h1 className="employement-head">Salary Range</h1>
{['10000000', '20000000', '30000000', '40000000'].map((value, idx) => (
  <div className="filter-option" key={value}>
    <input
      type="radio"
      id={`salary${idx}`}
      value={value}
      name="salary"
      checked={salaryrange === value}
      onChange={this.handlesalarychange}
    />
    <label htmlFor={`salary${idx}`} className='one'>
      {parseInt(value) / 1000000} LPA and above
    </label>
  </div>
))}

                </form>
              </div>
            </div>
            <div className="right-section">
              <form className="search-form" onSubmit={this.handlesearchsubmit}>
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input"
                  onChange={this.handlesearchinput}
                />
                <button type="submit" className="search-btn">
                  <BsSearch className="search-icon" />
                </button>
              </form>
              {this.renderjobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs