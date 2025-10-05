import { Component } from 'react'
import Cookies from 'js-cookie'
import './index.css'

class AppliedJobs extends Component {
  render() {
    const username = Cookies.get('username'); // get logged-in username
const appliedJobs =
  JSON.parse(localStorage.getItem(`appliedJobs_${username}`)) || [];


    return (
      <div className="applied-container">
        <h1 className="applied-title">Applied Jobs</h1>
        {appliedJobs.length === 0 ? (
          <p className="no-jobs">No jobs applied yet.</p>
        ) : (
          <ul className="applied-list">
            {appliedJobs.map(job => (
              <li key={job.id} className="applied-card">
                <img
                  src={job.companyLogoUrl}
                  alt="company logo"
                  className="logo"
                />
                <div className="job-info">
                  <h2 className="job-title">{job.title}</h2>
                  <p className="job-location">{job.location}</p>
                  <p className="job-type">{job.employmentType}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default AppliedJobs