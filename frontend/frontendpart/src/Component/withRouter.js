import { useParams, useLocation, useNavigate } from 'react-router-dom';

export function withRouter(Component) {
  return props => {
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    return <Component {...props} params={params} location={location} navigate={navigate} />
  }
}