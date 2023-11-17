import { useRef, useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import { breadcrumbData } from './data';
import Footer from '../../../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import reportsThunk from '../../../redux/thunks/reportsThunk';
import { TOOL_NAME } from '../../../utils/constants';
import Modal from '../../../components/Modal';
import DownloadLink from 'react-download-link';
import reportsService from '../../../api/services/reportsService';
import PDFModal from '../../../components/PDFModal';

const getRiskLevelClassName = (status) => {
  switch (status) {
    case 'Low':
      return '#ffff00';
    case 'Medium':
      return '#ffa500';
    case 'High':
      return '#ff0000';
    case 'Informational':
      return '#0000ff';
    case 'False Positives':
      return '#008000';
    default:
      return '';
  }
};

const WebApplicationSecurity = () => {
  const dispatch = useDispatch();
  const reportContentRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const pipelineID = useSelector((state) => state.actionPipeline.pipelineID);
  const isReportFetching = useSelector((state) => state.reports.isReportFetching);
  const reportData = useSelector((state) => state.reports.reportData);
  const reportFile = useSelector((state) => state.reports.reportFile);

  useEffect(() => {
    dispatch(
      reportsThunk.getReports({
        pipeline_id: pipelineID,
        tool_name: TOOL_NAME.OWASPZAP,
      })
    );
  }, [dispatch, pipelineID]);

  const handleEmailReports = async () => {
    await reportsService.emailReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.OWASPZAP,
    });
  };

  const handleDownloadReports = async () => {
    const response = await reportsService.downloadReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.OWASPZAP,
    });

    return response.data;
  };

  const handleViewReport = () => {
    setShowModal(true);
  };

  return (
    <div className='app-wrapper'>
      <Modal
        loading={isReportFetching}
        message='Fetching report'
      />

      {showModal && (
        <PDFModal
          title='Web Application Security Report'
          file={reportFile?.PDF}
          setShowModal={setShowModal}
        />
      )}

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
              <h1 className='app-page-title mb-0'>Web Application Security Report </h1>
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
                        filename='Web_Application_Security_Report.html'
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
              <>
                <div className='row g-4 mb-4'>
                  <div className='col-6 col-lg-4'>
                    <div className='app-card app-card-stat shadow-sm h-100'>
                      <div className='app-card-body p-3 p-lg-4'>
                        <div className='row text-center'>
                          <div className='col-12'>
                            <h4 className='stats-type mb-1'>Site</h4>
                            <div className='pt-2'>
                              <p>{reportData?.site[0]?.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-6 col-lg-4'>
                    <div className='app-card app-card-stat shadow-sm h-100'>
                      <div className='app-card-body p-3 p-lg-4'>
                        <div className='row text-center'>
                          <div className='col-12'>
                            <h4 className='stats-type mb-1'>Host</h4>
                            <div className='pt-2'>
                              <p>{reportData?.site[0]?.host}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-6 col-lg-2'>
                    <div className='app-card app-card-stat shadow-sm h-100'>
                      <div className='app-card-body p-3 p-lg-4'>
                        <div className='row text-center'>
                          <div className='col-12'>
                            <h4 className='stats-type mb-1'>Port</h4>
                            <div className='pt-2'>
                              <p>{reportData?.site[0]?.port}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-6 col-lg-2'>
                    <div className='app-card app-card-stat shadow-sm h-100'>
                      <div className='app-card-body p-3 p-lg-4'>
                        <div className='row text-center'>
                          <div className='col-12'>
                            <h4 className='stats-type mb-1'>SSL</h4>
                            <div className='pt-2'>
                              <p>{reportData?.site[0]?.ssl}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row g-4 mb-4'>
                  <div className='col-12 col-lg-12 col-md-12'>
                    <div className='app-card app-card-basic shadow-sm'>
                      <div className='app-card-body'>
                        <div className='col-md-12 col-lg-12 pt-2 pb-2'>
                          <div className='table-responsive m-3'>
                            <table className='table table-bordered mb-0 text-left'>
                              <thead>
                                <tr>
                                  <th className='cell'>Alert Name</th>
                                  <th className='cell'>Risk Level</th>
                                  <th className='cell'>Number of Instances</th>
                                  <th className='cell'>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {reportData?.site[0].alerts.map((item) => (
                                  <tr key={item.alert}>
                                    <td className='cell'>{item.alert}</td>
                                    <td className='cell'>
                                      <span
                                        className='badge'
                                        style={{
                                          color: `${
                                            getRiskLevelClassName(item.riskdesc.replace(/\([^)]*\)/g, '').trim()) ===
                                            '#ffff00'
                                              ? 'black'
                                              : ''
                                          }`,
                                          backgroundColor: `${getRiskLevelClassName(
                                            item.riskdesc.replace(/\([^)]*\)/g, '').trim()
                                          )}`,
                                        }}>
                                        {item.riskdesc.replace(/\([^)]*\)/g, '').trim()}
                                      </span>
                                    </td>
                                    <td>{item.count}</td>
                                    <td>
                                      <span
                                        role='link'
                                        className='viewReport'
                                        onClick={handleViewReport}>
                                        View Detail Report
                                      </span>
                                    </td>
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
              </>
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

export default WebApplicationSecurity;
