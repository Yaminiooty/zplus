import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetToolsDashboard } from '../redux/slices/toolsDashboardSlice';
import { resetPipelineDataStates, resetToolsConfig } from '../redux/slices/toolsConfigSlice';
import { resetActionPipeline } from '../redux/slices/actionPipelineSlice';

const Breadcrumb = ({ breadcrumbData }) => {
  const dispatch = useDispatch();

  const handleDashboardClick = () => {
    dispatch(resetToolsDashboard());
    dispatch(resetToolsConfig());
    dispatch(resetPipelineDataStates());
    dispatch(resetActionPipeline());
  };

  return (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumb align-items-center'>
        {breadcrumbData.map((item) => (
          <li
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            key={item.id}>
            {item.link === '/dashboard' ? (
              <Link
                to={item.link}
                onClick={handleDashboardClick}>
                <i className={item.logo}></i> {item.title}
              </Link>
            ) : (
              <Link to={item.link}>
                <i className={item.logo}></i> {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
