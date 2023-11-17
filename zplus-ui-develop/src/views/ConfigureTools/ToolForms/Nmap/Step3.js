import { useSelector } from 'react-redux';

const Step3 = () => {
  const nmapConfig = useSelector((state) => state.toolsConfig.nmapConfig);

  const fieldMappings = {
    target: 'Target(s)',
    scan_type: 'Scan type',
    port: 'Port range',
    scan_timing: 'Scan timing',
    output_format: 'Output formats',
    aggressive_scan: 'Aggressive scan',
    script_scan: 'Script scan',
    traceroute: 'Traceroute',
    show_port_state_reason: 'Show port state reasons',
    scan_all_ports: 'Scan all ports',
    version_detection_intensity: 'Version detection intensity',
    max_round_trip_timeout: 'Max Round-trip timeout',
    max_retries: 'Max retries',
    fragment_packets: 'Fragment packets',
    service_version_probe: 'Service version probe',
    default_nse_scripts: 'Default NSE scripts',
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
                const fieldValue = nmapConfig ? nmapConfig[fieldName] : '';
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

export default Step3;
