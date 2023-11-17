import HeaderWithSidebar from '../../components/HeaderWithSidebar';
import Accordion from './components/Accordion';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import toolsConfigThunk from '../../redux/thunks/toolsConfigThunk';
import actionPipelineThunk from '../../redux/thunks/actionPipelineThunk';
import { resetToolsConfig } from '../../redux/slices/toolsConfigSlice';
import Breadcrumb from '../../components/Breadcrumb';
import { breadcrumbData } from './data';

const ReviewAndSave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isConfigFetching = useSelector((state) => state.toolsConfig.isConfigFetching);
  const isConfigFetched = useSelector((state) => state.toolsConfig.isConfigFetched);
  const toolsConfigData = useSelector((state) => state.toolsConfig.toolsConfigData);
  const isPipielineCreating = useSelector((state) => state.actionPipeline.isPipielineCreating);
  const isPipelineCreated = useSelector((state) => state.actionPipeline.isPipelineCreated);
  const pipelineID = useSelector((state) => state.actionPipeline.pipelineID);

  useEffect(() => {
    dispatch(toolsConfigThunk.getToolsConfig());
  }, [dispatch]);

  useEffect(() => {
    if (isPipelineCreated) {
      navigate(`/action-pipeline?pipeline_id=${pipelineID}`);
      dispatch(resetToolsConfig());
    }
  }, [dispatch, isPipelineCreated, navigate, pipelineID]);

  const handleCreateActionPipeline = () => {
    dispatch(actionPipelineThunk.createPipeline());
  };

  return (
    <>
      <Modal
        loading={isConfigFetching}
        message='Fetching pipeline tools configuration'
      />

      <Modal
        loading={isPipielineCreating}
        message='Creating pipeline'
      />

      <HeaderWithSidebar title='Tool Review & Create Pipeline' />

      <div className='app-wrapper'>
        <div className='content pt-3 p-md-3'>
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

            <h1 className='app-page-title'>Tool Review & Create Pipeline</h1>

            <div className='row g-4 mb-4'>
              <div className='col-12 col-lg-12 col-md-12 col-sm-12'>
                <div className='app-card shadow-sm'>
                  <div className='app-card-body px-4 pt-3 pb-3'>
                    <div className='tab-card'>
                      <div className='tab-card-body'>
                        {isConfigFetched && <Accordion pipelineData={toolsConfigData} />}
                        <div className='row mt-4'>
                          <div className='col-md-12 text-end'>
                            <button
                              to={'/action-pipeline'}
                              className='btn btn-next btn-sm btnNext'
                              onClick={handleCreateActionPipeline}>
                              <i className='fa-solid fa-angle-right'></i> Create Action Pipeline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ReviewAndSave;
