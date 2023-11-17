import Breadcrumb from '../../../components/Breadcrumb';
import Footer from '../../../components/Footer';
import Modal from '../../../components/Modal';
import { breadcrumbData } from './data';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import reportsThunk from '../../../redux/thunks/reportsThunk';
import { TOOL_NAME } from '../../../utils/constants';
import DownloadLink from 'react-download-link';
import reportsService from '../../../api/services/reportsService';

const PerformanceTesting = () => {
  const dispatch = useDispatch();
  const reportContentRef = useRef();
  const pipelineID = useSelector((state) => state.actionPipeline.pipelineID);
  const isReportFetching = useSelector((state) => state.reports.isReportFetching);
  const reportData = useSelector((state) => state.reports.reportData);

  useEffect(() => {
    dispatch(reportsThunk.getReports({ pipeline_id: pipelineID, tool_name: TOOL_NAME.JMETER }));
  }, [dispatch, pipelineID]);

  const handleEmailReports = async () => {
    await reportsService.emailReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.JMETER,
    });
  };

  const handleDownloadReports = async () => {
    const response = await reportsService.downloadReport({
      data: reportContentRef.current.innerHTML,
      pipeline_id: pipelineID,
      tool_name: TOOL_NAME.JMETER,
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
              <h1 className='app-page-title mb-0'>Performance Testing Report </h1>
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
                        filename='Performance_Testing_Report.html'
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
              Object.keys(reportData?.data).map((item, index) => (
                <div
                  className='row g-4 mb-4'
                  key={index}>
                  <div className='col-12 col-lg-12 col-md-12'>
                    <div className='app-card app-card-basic shadow-sm'>
                      <div className='app-card-body'>
                        <div className='col-md-12 col-lg-12 pt-2 pb-2'>
                          <div className='table-responsive m-3'>
                            <div className='d-flex flex-row align-items-center mb-1'>
                              <h6 className='m-0'>Transaction:</h6>
                              <p className='m-0 ps-2'>{reportData?.data[item]?.transaction}</p>
                            </div>
                            <div className='d-flex flex-row gap-4 mb-3'>
                              <div className='d-flex flex-row align-items-center'>
                                <h6 className='m-0'>Sample Count:</h6>
                                <p className='m-0 ps-2'>{reportData?.data[item]?.sampleCount}</p>
                              </div>
                              <div className='d-flex flex-row align-items-center'>
                                <h6 className='m-0'>Error Count:</h6>
                                <p className='m-0 ps-2'>{reportData?.data[item]?.errorCount}</p>
                              </div>
                              <div className='d-flex flex-row align-items-center'>
                                <h6 className='m-0'>Error percentage:</h6>
                                <p className='m-0 ps-2'>{reportData?.data[item]?.errorPct}%</p>
                              </div>
                            </div>
                            <table className='table table-bordered mb-0 mt-2 text-left'>
                              <thead>
                                <tr>
                                  <th className='cell'>Max Response Time</th>
                                  <th className='cell'>Mean Response Time</th>
                                  <th className='cell'>Median Response Time</th>
                                  <th className='cell'>Min Response Time</th>
                                  <th className='cell'>Received Data (KB/sec)</th>
                                  <th className='cell'>Sent Data (KB/sec)</th>
                                  <th className='cell'>Throughput</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className='cell'>{reportData?.data[item]?.maxResTime.toFixed(2)} ms</td>
                                  <td className='cell'>{reportData?.data[item]?.meanResTime.toFixed(2)} ms</td>
                                  <td className='cell'>{reportData?.data[item]?.medianResTime.toFixed(2)} ms</td>
                                  <td className='cell'>{reportData?.data[item]?.minResTime.toFixed(2)} ms</td>
                                  <td className='cell'>{reportData?.data[item]?.receivedKBytesPerSec.toFixed(3)}</td>
                                  <td className='cell'>{reportData?.data[item]?.sentKBytesPerSec.toFixed(3)}</td>
                                  <td className='cell'>{reportData?.data[item]?.throughput.toFixed(2)} ms</td>
                                </tr>
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

export default PerformanceTesting;
