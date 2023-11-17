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
import HTMLModal from '../../../components/HTMLModal';

const DependencySecurity = () => {
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
        tool_name: TOOL_NAME.OWASPDEPENDENCY,
      })
    );
  }, [dispatch, pipelineID]);

  const handleEmailReports = async () => {
    await reportsService.emailReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.OWASPDEPENDENCY,
    });
  };

  const handleDownloadReports = async () => {
    const response = await reportsService.downloadReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.OWASPDEPENDENCY,
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
        <HTMLModal
          title='Dependency Security Report'
          file={reportFile?.HTML}
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
              <h1 className='app-page-title mb-0'>Dependency Security Report </h1>
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
                        filename='Dependency_Security_Report.html'
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
            {reportData?.dependencies ? (
              reportData?.dependencies.map((item, index) => (
                <div
                  className='row g-4 mb-4'
                  key={index}>
                  <div className='col-12 col-lg-12 col-md-12'>
                    <div className='app-card app-card-basic shadow-sm'>
                      <div className='app-card-body'>
                        <div className='col-md-12 col-lg-12 pt-2 pb-2'>
                          <div className='table-responsive m-3'>
                            <div className='d-flex flex-row align-items-center'>
                              <h6 className='m-0'>Dependency:</h6>
                              <p className='m-0 ps-2'>{item.fileName}</p>
                            </div>
                            <div className='d-flex flex-row align-items-center'>
                              <h6 className='m-0'>Description:</h6>
                              <p className='m-0 ps-2'>{item.description}</p>
                            </div>
                            <table className='table table-bordered mt-3'>
                              <thead>
                                <tr>
                                  <th>Vulnerability Name</th>
                                  <th>Source</th>
                                  <th>Severity</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.vulnerabilities.map((vulnerability, index) => (
                                  <tr key={index}>
                                    <td>{vulnerability.name}</td>
                                    <td>{vulnerability.source}</td>
                                    <td>{vulnerability.severity}</td>
                                    <td>
                                      <span
                                        className='no-select viewReport'
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
              ))
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

export default DependencySecurity;
