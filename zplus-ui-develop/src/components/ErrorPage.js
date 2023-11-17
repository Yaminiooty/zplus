import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const ErrorPage = () => {
  return (
    <div id='notfound'>
      <div className='notfound'>
        <img
          className='logo-icon me-2'
          src={logo}
          alt='logo'
          width='200'
        />
        <div className='notfound-404'>
          <h1>Oops!</h1>
        </div>
        <h2>404 - Page not found</h2>
        <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
        <Link to='/dashboard'>Go To Homepage</Link>
      </div>
    </div>
  );
};

export default ErrorPage;
