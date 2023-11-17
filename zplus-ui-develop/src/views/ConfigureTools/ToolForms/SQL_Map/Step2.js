import { useSelector } from 'react-redux';

const Step2 = () => {
  const sqlMapConfig = useSelector((state) => state.toolsConfig.sqlMapConfig);

  const fieldMappings = {
    target: 'Target URL',
    testing_mode: 'Testing mode',
    testing_level: 'Testing level',
    verbosity_level: 'Verbosity level',
    test_forms: 'Test forms',
    check_for_additional_urls: 'Check for additional URLs',
    cookies: 'Cookies',
    headers: 'Headers',
    data: 'Data',
    user_agent: 'User agent',
    number_of_threads: 'Number of threads',
    exclude_system_databases: 'Exclude system databases',
    current_session_user: 'Current session user',
    current_database: 'Current database',
    enumerate_users: 'Enumerate DBMS users',
    enumerate_passwords: 'Enumerate DBMS users password hashes',
    enumerate_privileges: 'Enumerate DBMS users privilages',
    enumerate_roles: 'Enumerate DBMS users roles',
    enumerate_databases: 'Enumerate DBMS databases',
    enumerate_tables: 'Enumerate DBMS database tables',
    enumerate_columns: 'Enumerate DBMS database table columns',
    enumerate_schemas: 'Enumerate DBMS schema',
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
                const fieldValue = sqlMapConfig ? sqlMapConfig[fieldName] : '';
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
