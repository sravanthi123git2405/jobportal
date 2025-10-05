import { Component } from 'react';
import Loader from 'react-loader-spinner';
import './index.css';

const apiconstants = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

class ProfileComponent extends Component {
  state = { profile: {}, apistatus: apiconstants.initial };

  componentDidMount() {
    this.getprofiledetails();
  }

  getprofiledetails = async () => {
    this.setState({ apistatus: apiconstants.inprogress });

    try {
      const url = 'http://localhost:5000/users/profile';
      const options = {
        method: 'GET',
        credentials: 'include', // send cookie automatically
      };

      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const updateddata = {
          name: data.profile_details.name,
          shortBio: data.profile_details.short_bio,
        };
        this.setState({ profile: updateddata, apistatus: apiconstants.success });
      } else {
        this.setState({ apistatus: apiconstants.failure });
      }
    } catch (err) {
      this.setState({ apistatus: apiconstants.failure });
    }
  };

  renderprofile = () => {
    const { profile } = this.state;
    const { name, shortBio } = profile;
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    return (
      <div className="profile-card">
        <div className="profile-initial">{initial}</div>
        <h1 className="name">{name}</h1>
        <p className="shortbio">{shortBio}</p>
      </div>
    );
  };

  renderfailure = () => (
    <button className="btn-retry" onClick={this.getprofiledetails}>
      Retry
    </button>
  );

  renderloading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  );

  rendercontent = () => {
    const { apistatus } = this.state;
    switch (apistatus) {
      case apiconstants.success:
        return this.renderprofile();
      case apiconstants.failure:
        return this.renderfailure();
      case apiconstants.inprogress:
        return this.renderloading();
      default:
        return null;
    }
  };

  render() {
    return <>{this.rendercontent()}</>;
  }
}

export default ProfileComponent;