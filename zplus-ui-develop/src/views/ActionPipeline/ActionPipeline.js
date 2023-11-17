import HeaderWithSidebar from '../../components/HeaderWithSidebar';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ToolActionCard from './components/ToolActionCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionPipelineThunk from '../../redux/thunks/actionPipelineThunk';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logoMapping } from '../../utils/logoMapping';
import { introMapping } from '../../utils/introMapping';
import { TOOL_NAME } from '../../utils/constants';
import { breadcrumbData } from './data';
import { toast } from 'react-toastify';

const reportsPageLink = (toolName) => {
  switch (toolName) {
    case TOOL_NAME.NMAP:
      return 'network-discovery';
    case TOOL_NAME.METASPLOIT:
      return 'vulnerability-exploitation';
    case TOOL_NAME.SQLMAP:
      return 'sql-injection-testing';
    case TOOL_NAME.OWASPZAP:
      return 'web-application-security';
    case TOOL_NAME.OWASPDEPENDENCY:
      return 'dependency-security';
    case TOOL_NAME.OPENVAS:
      return 'security-auditing';
    case TOOL_NAME.JMETER:
      return 'performance-testing';
    default:
      return '';
  }
};

const ActionPipeline = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [dropdownText, setDropdownText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const pipeline_id = searchParams.get('pipeline_id');
  const pipelineStatus = useSelector((state) => state.actionPipeline.pipelineStatus);
  const isPipelineStarted = useSelector((state) => state.actionPipeline.isPipelineStarted);
  const isPipelineStatusFetched = useSelector((state) => state.actionPipeline.isPipelineStatusFetched);
  const isPipelineCompleted = useSelector((state) => state.actionPipeline.isPipelineCompleted);
  const selectedTools = useSelector((state) => state.toolsDashboard.selectedTools);

  const handleSearchInput = (event) => {
    setSearchText(event.target.value);
  };

  const handleSelectInput = (event) => {
    setDropdownText(event.target.value);
  };

  useEffect(() => {
    if (isPipelineCompleted) {
      toast.success('Pipeline execution is completed.');
    }
  }, [isPipelineCompleted]);

  //polling to get current pipeline status
  useEffect(() => {
    let pollingStatus;
    const pollPipelineStatus = () => {
      if (pipeline_id && isPipelineStarted && !isPipelineCompleted) {
        dispatch(actionPipelineThunk.getPipelineStatus(pipeline_id));
      }
    };

    if (pipeline_id && isPipelineStarted && !isPipelineCompleted) {
      pollPipelineStatus();
      pollingStatus = setInterval(pollPipelineStatus, 5000);
    }

    return () => {
      clearInterval(pollingStatus);
    };
  }, [dispatch, pipeline_id, isPipelineStarted, isPipelineCompleted]);

  useEffect(() => {
    const filteredSearchData = pipelineStatus?.filter((data) =>
      data.tool_name.toLowerCase().includes(searchText.toLowerCase())
    );
    const filteredDropdownData = filteredSearchData?.filter((data) =>
      data.status.toLowerCase().includes(dropdownText.toLowerCase())
    );

    setFilteredData(filteredDropdownData);
  }, [searchText, dropdownText, pipelineStatus, isPipelineStatusFetched]);

  const formattedPipelineStatus = filteredData?.map((tool) => ({
    ...tool,
    tool_image: logoMapping[tool.tool_name],
    tool_intro: introMapping[tool.tool_name],
  }));

  const handleRunActionPipeline = () => {
    dispatch(actionPipelineThunk.runPipeline({ pipeline_id: pipeline_id }));
  };

  const handleViewReports = () => {
    if (isPipelineCompleted) {
      navigate(`/reports/${reportsPageLink(selectedTools[0])}`);
    }
  };

  return (
    <>
      <HeaderWithSidebar title='Action Pipeline Dashboard' />

      <div className='app-wrapper'>
        <div className='content pt-3 p-md-3 p-lg-4'>
          <div className='container-xl'>
            <div className='row g-4 mb-4'>
              <div className='col-12 col-lg-12 col-md-12 col-sm-12'>
                <div className='app-card app-card-basic d-flex flex-column align-items-start shadow-sm'>
                  <div className='app-card-body px-4'>
                    <Breadcrumb breadcrumbData={breadcrumbData} />
                  </div>
                </div>
              </div>
            </div>

            <div className='row g-3 mb-4 align-items-center'>
              <div className='col-auto col-lg-4'>
                <h1 className='app-page-title mb-0'>Action Pipeline Dashboard</h1>
              </div>
              <div className='col-auto col-lg-3'>
                <form className='docs-search-form row gx-1 align-items-center'>
                  <input
                    type='text'
                    id='search-docs'
                    name='searchdocs'
                    className='form-control search-docs'
                    placeholder='Search'
                    value={searchText}
                    onChange={handleSearchInput}
                  />
                </form>
              </div>
              <div className='col-auto col-lg-2'>
                <select
                  className='form-select w-auto'
                  onChange={handleSelectInput}
                  defaultValue=''>
                  <option value=''>All</option>
                  <option value='pending'>Pending</option>
                  <option value='in-progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                  <option value='failed'>Failed</option>
                </select>
              </div>
              <div className='col-auto col-lg-3 d-flex flex-row justify-content-end gap-3'>
                <button
                  className='btn btn-back btn-sm'
                  onClick={handleViewReports}
                  disabled={!isPipelineCompleted}>
                  <i className='fa-regular fa-file'></i> View Reports
                </button>
                <button
                  className='btn btn-next btn-sm'
                  onClick={handleRunActionPipeline}
                  disabled={isPipelineStarted}>
                  <i className='fa-regular fa-circle-play'></i> Run Pipeline
                </button>
              </div>
            </div>

            <div className='row g-4 mb-4'>
              <ToolActionCard data={formattedPipelineStatus} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ActionPipeline;
