import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import useToggle from '../hooks/useToggle';
import authThunks from '../redux/thunks/authThunk';
import { resetLogoutStates } from '../redux/slices/authSlice';
import { resetToolsDashboard, resetToolsData } from '../redux/slices/toolsDashboardSlice';
import { resetPipelineDataStates, resetSaveConfigStates, resetToolsConfig } from '../redux/slices/toolsConfigSlice';
import { resetActionPipeline } from '../redux/slices/actionPipelineSlice';
import { resetReportStates } from '../redux/slices/reportsSlice';

const HeaderWithSidebar = ({ selectedTools, title, reports }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPage = pathname.split('/')[2];
  const [profileDropdown, toggleProfileDropdown] = useToggle();
  const [sidepanel, toggleSidepanel] = useToggle();
  const isLogout = useSelector((state) => state.auth.isLogout);
  const dropdownRef = useRef(null);
  const sidepanelRef = useRef(null);

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

  useEffect(() => {
    const closeSidepanel = (e) => {
      if (sidepanel && sidepanelRef.current && !sidepanelRef.current.contains(e.target)) {
        toggleSidepanel(false);
      }
    };

    document.addEventListener('click', closeSidepanel);
    return () => {
      document.removeEventListener('click', closeSidepanel);
    };
  }, [sidepanel, toggleSidepanel]);

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

  const handleReportClick = () => {
    dispatch(resetReportStates());
  };

  return (
    <header className='app-header fixed-top'>
      <div className='app-header-inner'>
        <div className='container-fluid py-2'>
          <div className='app-header-content'>
            <div className='row justify-content-between align-items-center'>
              <div className='col-auto'>
                <div
                  id='sidepanel-toggler'
                  className='sidepanel-toggler d-inline-block d-xl-none'
                  onClick={(e) => {
                    e.stopPropagation(); // Stop event propagation
                    toggleSidepanel(false);
                  }}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='30'
                    height='30'
                    viewBox='0 0 30 30'
                    role='img'>
                    <title>Menu</title>
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeMiterlimit='10'
                      strokeWidth='2'
                      d='M4 7h22M4 15h22M4 23h22'></path>
                  </svg>
                </div>
              </div>

              <div className='col-auto'>
                <div
                  className='app-user-dropdown dropdown'
                  ref={dropdownRef}>
                  <div
                    className={`nav-link dropdown-toggle ${profileDropdown ? 'show' : ''}`}
                    onClick={toggleProfileDropdown}>
                    <i className='fas fa-user-circle fa-2x'></i>
                  </div>
                  <div
                    className={`dropdown-menu ${profileDropdown ? 'show' : ''}`}
                    style={{ right: 0, top: 46 }}>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id='app-sidepanel'
        className={`app-sidepanel ${sidepanel ? 'sidepanel-visible' : ''}`}>
        <div
          id='sidepanel-drop'
          className='sidepanel-drop'></div>
        <div
          className='sidepanel-inner d-flex flex-column'
          ref={sidepanelRef}>
          <div
            id='sidepanel-close'
            className='sidepanel-close d-xl-none'
            onClick={toggleSidepanel}>
            &times;
          </div>
          <div
            className='app-branding'
            onClick={handleDashboardClick}>
            <Link
              to='/dashboard'
              className='app-logo'>
              <img
                className='logo-icon me-2'
                src={logo}
                alt='logo'
              />
            </Link>
          </div>

          <nav
            id='app-nav-main'
            className='app-nav app-nav-main flex-grow-1'>
            {title && (
              <ul
                className='app-menu list-unstyled accordion'
                id='menu-accordion'>
                <li className='nav-item'>
                  <Link className='nav-link active'>
                    <span className='nav-icon'>
                      <i className='fa-solid fa-list-check'></i>
                    </span>
                    <span className='nav-link-text'>{title}</span>
                  </Link>
                </li>
              </ul>
            )}
            {selectedTools && (
              <ul
                className='app-menu list-unstyled accordion'
                id='menu-accordion'>
                {selectedTools.map((tool) => {
                  const isActive = tool === decodeURIComponent(currentPage);

                  return (
                    <li
                      className='nav-item'
                      key={tool}>
                      <Link
                        className={`nav-link ${isActive ? 'active' : ''}`}
                        to={`/configure-tools/${tool}`}
                        replace={true}>
                        <span className='nav-icon'>
                          <i className={`fa-regular ${isActive ? 'fa-circle-check' : 'fa-circle'}`}></i>
                        </span>
                        <span className='nav-link-text'>{tool}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {reports && (
              <ul
                className='app-menu list-unstyled accordion'
                id='menu-accordion'>
                {reports.map((report) => {
                  const isActive = report.pageLink === decodeURIComponent(currentPage);
                  return (
                    <li
                      className='nav-item'
                      key={report.id}
                      onClick={handleReportClick}>
                      <Link
                        className={`nav-link ${isActive ? 'active' : ''}`}
                        to={`/reports/${report.pageLink}`}
                        replace={true}>
                        <span className='nav-icon'>
                          <i className={`fa-regular ${isActive ? 'fa-circle-check' : 'fa-circle'}`}></i>
                        </span>
                        <span className='nav-link-text'>{report.reportName}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderWithSidebar;
