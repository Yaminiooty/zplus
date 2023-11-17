import { useRef, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import { breadcrumbData } from './data';
import Footer from '../../../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import reportsThunk from '../../../redux/thunks/reportsThunk';
import { TOOL_NAME } from '../../../utils/constants';
import Modal from '../../../components/Modal';
import DownloadLink from 'react-download-link';
import reportsService from '../../../api/services/reportsService';

const SQLInjection = () => {
  const dispatch = useDispatch();
  const reportContentRef = useRef();
  const pipelineID = useSelector((state) => state.actionPipeline.pipelineID);
  const isReportFetching = useSelector((state) => state.reports.isReportFetching);
  const reportData = useSelector((state) => state.reports.reportData);

  useEffect(() => {
    dispatch(
      reportsThunk.getReports({
        pipeline_id: pipelineID,
        tool_name: TOOL_NAME.SQLMAP,
      })
    );
  }, [dispatch, pipelineID]);

  const handleEmailReports = async () => {
    await reportsService.emailReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.SQLMAP,
    });
  };

  const handleDownloadReports = async () => {
    const response = await reportsService.downloadReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.SQLMAP,
    });

    return response.data;
  };

  return (
    <div className='app-wrapper'>
      <Modal
        loading={isReportFetching}
        message='Fetching report'
      />

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

          <div className='row g-3 mb-4 align-items-center justify-content-between'>
            <div className='col-auto'>
              <h1 className='app-page-title mb-0'>SQL Injection Testing Report </h1>
            </div>
            <div className='col-auto'>
              <div className='page-utilities'>
                <div className='row g-2 justify-content-start justify-content-md-end align-items-center'>
                  <div className='col-auto'>
                    <button
                      className='btn app-btn-secondary'
                      onClick={handleEmailReports}>
                      Email Reports
                    </button>
                  </div>
                  <div className='col-auto'>
                    <button className='btn app-btn-secondary'>
                      <DownloadLink
                        label='Download Reports'
                        filename='SQL_Injection_Testing_Report.html'
                        exportFile={handleDownloadReports}
                        style={{ textDecoration: 'none', color: '#5d6778' }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={reportContentRef}>
            {reportData ? (
              <div className='row g-4 mb-4'>
                <div className='col-12 col-lg-12 col-md-12'>
                  <div className='app-card app-card-basic shadow-sm'>
                    <div className='app-card-body'>
                      <div className='col-md-12 col-lg-12 pt-2 pb-2'>
                        <div className='table-responsive m-3'>
                          <table className='table table-bordered'>
                            <thead>
                              <tr>
                                <th>Title</th>
                                <th>Payload</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(reportData?.techniques?.value[0]?.data)?.map((item) => (
                                <tr key={item}>
                                  <td>{reportData.techniques.value[0].data[item].title}</td>
                                  <td>{reportData.techniques.value[0].data[item].payload}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='d-flex flex-row justify-content-center align-items-center'>
                <h2>Tool execution failed.</h2>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SQLInjection;
