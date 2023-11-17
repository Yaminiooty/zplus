import { useSelector } from 'react-redux';

const Step2 = () => {
  const owaspDependencyCheckConfig = useSelector((state) => state.toolsConfig.owaspDependencyCheckConfig);

  const fieldMappings = {
    project_file: 'Project file (zip)',
    output_format: 'Output format',
    scan_dependencies: 'Perform dependency scanning',
    scan_dev_dependencies: 'Include development dependencies',
    suppress_update_check: 'Suppress update check',
    suppress_cve_reports: 'Suppress CVE reports',
    suppress_cve_reports_file: 'Suppress CVE reports file',
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
                const fieldValue = owaspDependencyCheckConfig ? owaspDependencyCheckConfig[fieldName] : '';
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
