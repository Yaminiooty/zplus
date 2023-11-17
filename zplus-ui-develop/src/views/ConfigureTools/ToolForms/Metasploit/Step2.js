import { useSelector } from 'react-redux';

const Step2 = () => {
  const metasploitConfig = useSelector((state) => state.toolsConfig.metasploitConfig);
  const metasploitModulesOptions = useSelector((state) => state.toolsConfig.metasploitModulesOptions);

  const fieldMappings = {
    module_type: 'Module type',
    module_fullname: 'Module name',
    use_default_values: 'Use default values',
    advanced_options: 'Show advanced options',
    additional_comments: 'Additional comments',

    ...metasploitModulesOptions?.reduce((acc, field) => {
      acc[field.name] = field.name;
      return acc;
    }, {}),
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
                const fieldValue = metasploitConfig ? metasploitConfig[fieldName] : '';
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
