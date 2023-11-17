import { useSelector } from 'react-redux';

const Step2 = () => {
  const openVASConfig = useSelector((state) => state.toolsConfig.openVASConfig);

  const fieldMappings = {
    target: 'Target IP/Hostname',
    tcp: 'Scan port range (TCP)',
    udp: 'Scan port range (UDP)',
    scanner_type: 'Scanner type',
    scan_config: 'Scan config',
    no_of_concurrent_nvt_per_host: 'Number of concurrent NVTs per host',
    no_of_concurrent_scanned_host: 'Number of concurrent scanned host',
    report_format: 'Report format',
    additional_comments: 'Additional comments',
  };

  return (
    <div
      id='profile'
      role='tabpanel'>
      <div className='row'>
        <div className='col-md-12 col-lg-12 col-sm-12 col-12'>
          <h4 className='app-card-title'>Form Preview </h4>
          <table className='table table-bordered'>
            <tbody>
              {Object.keys(fieldMappings).map((fieldName) => {
                const fieldValue = openVASConfig ? openVASConfig[fieldName] : '';
                let renderedValue;
                if (typeof fieldValue === 'boolean') {
                  renderedValue = fieldValue ? 'Yes' : 'No';
                } else {
                  renderedValue = fieldValue;
                }

                // Only render rows for filled fields
                if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && renderedValue !== 'No') {
                  return (
                    <tr key={fieldName}>
                      <th width='30%'>{fieldMappings[fieldName]}</th>
                      <td>{renderedValue}</td>
                    </tr>
                  );
                }
                return null; // Skip rendering for empty fields
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Step2;
