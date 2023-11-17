import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetToolsDashboard } from '../../../redux/slices/toolsDashboardSlice';
import { resetToolsConfig } from '../../../redux/slices/toolsConfigSlice';

const BreadcrumbContainer = ({ tool }) => {
  const dispatch = useDispatch();

  const handleDashboardClick = () => {
    dispatch(resetToolsDashboard());
    dispatch(resetToolsConfig());
  };

  return (
    <div className='row g-4 mb-4'>
      <div className='col-12 col-lg-12 col-md-12 col-sm-12'>
        <div className='app-card app-card-basic d-flex flex-column align-items-start shadow-sm'>
          <div className='app-card-body px-2'>
            <nav aria-label='breadcrumb'>
              <ol className='breadcrumb'>
                <li
                  className='breadcrumb-item'
                  onClick={handleDashboardClick}>
                  <Link to='/dashboard'>
                    <i className='fas fa-house'></i> Dashboard
                  </Link>
                </li>
                <li
                  className='breadcrumb-item active'
                  aria-current='page'>
                  <i className='fa-regular fa-circle-check'></i> {`${tool} Tool Configuration`}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbContainer;
