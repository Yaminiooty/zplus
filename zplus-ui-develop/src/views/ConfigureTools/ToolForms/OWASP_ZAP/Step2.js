import { useSelector } from 'react-redux';

const Step2 = () => {
  const owaspZapConfig = useSelector((state) => state.toolsConfig.owaspZapConfig);

  const fieldMappings = {
    target: 'Target URL',
    scan_type: 'Scan type',
    spider_type: 'Spider type',
    max_children: 'Max Children',
    recurse: 'Recurse',
    sub_tree_only: 'Sub tree only',
    attack_mode: 'Attack mode',
    authentication: 'Enable authentication',
    login_url: 'Login URL',
    username_parameter: 'Username parameter',
    password_parameter: 'Password parameter',
    username: 'Username',
    password: 'Password',
    logged_in_indicator: 'Logged in indicator',
    policy_template: 'Policy template',
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
                const fieldValue = owaspZapConfig ? owaspZapConfig[fieldName] : '';
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
