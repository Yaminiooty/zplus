import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';
import useToggle from '../hooks/useToggle';
import authThunks from '../redux/thunks/authThunk';
import { resetLogoutStates } from '../redux/slices/authSlice';
import { resetToolsDashboard, resetToolsData } from '../redux/slices/toolsDashboardSlice';
import { resetPipelineDataStates, resetSaveConfigStates, resetToolsConfig } from '../redux/slices/toolsConfigSlice';
import { resetActionPipeline } from '../redux/slices/actionPipelineSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileDropdown, toggleProfileDropdown] = useToggle();
  const isLogout = useSelector((state) => state.auth.isLogout);
  const dropdownRef = useRef(null);

  // Add a click event listener to the document to close the dropdown when clicked outside.
  useEffect(() => {
    const closeDropdown = (e) => {
      if (profileDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        toggleProfileDropdown(false);
      }
    };

    document.addEventListener('click', closeDropdown);

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [profileDropdown, toggleProfileDropdown]);

  const handleLogout = () => {
    dispatch(authThunks.logout());
  };

  useEffect(() => {
    if (isLogout) {
      navigate('/', { replace: true });
      dispatch(resetToolsDashboard());
      dispatch(resetToolsData());
      dispatch(resetToolsConfig());
      dispatch(resetSaveConfigStates());
      dispatch(resetPipelineDataStates());
      dispatch(resetActionPipeline());
      dispatch(resetLogoutStates());
    }
  }, [isLogout, dispatch, navigate]);

  const handleDashboardClick = () => {
    dispatch(resetToolsDashboard());
    dispatch(resetToolsConfig());
    dispatch(resetSaveConfigStates());
    dispatch(resetPipelineDataStates());
    dispatch(resetActionPipeline());
  };

  return (
    <nav className='navbar navbar-expand navbar-light bg-white pt-2 pb-2 shadow-sm sticky-top'>
      <div className='container-fluid'>
        <Link
          to='/dashboard'
          className='navbar-brand mb-1'
          onClick={handleDashboardClick}>
          <img
            width='200'
            src={logoImg}
            alt=''
          />
        </Link>

        <div id='navbarText'>
          <ul className='nav navbar-nav ms-auto'>
            <li
              className='nav-item dropdown'
              ref={dropdownRef}>
              <div
                className={`nav-link dropdown-toggle ${profileDropdown ? 'show' : ''}`}
                onClick={toggleProfileDropdown}>
                <i className='fas fa-user-circle'></i>
              </div>

              <div
                className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow ${profileDropdown ? 'show' : ''}`}
                style={{ right: 0 }}>
                <Link
                  className='dropdown-item no-select'
                  to='/user-profile'>
                  <i className='fas fa-user-alt'></i> Profile
                </Link>

                <Link
                  className='dropdown-item no-select'
                  to='/change-password'>
                  <i className='fas fa-solid fa-key'></i> Change Password
                </Link>

                <div className='dropdown-divider'></div>
                <Link
                  className='dropdown-item no-select'
                  onClick={handleLogout}>
                  <i className='fas fa-solid fa-right-from-bracket'></i> Logout
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
