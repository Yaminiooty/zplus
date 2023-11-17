import React from 'react';
import { useSelector } from 'react-redux';

const Step2 = () => {
  const jmeterConfig = useSelector((state) => state.toolsConfig.jmeterConfig);

  const fieldMappings = {
    test_plan_file: 'Test Plan file (jmx)',
    number_of_threads_udf: 'User Defined Variable for Number of threads',
    number_of_threads: 'Number of threads',
    ramp_up_period_udf: 'User Defined Variable for Ramp-Up period (seconds)',
    ramp_up_period: 'Ramp-Up period (seconds)',
    loop_count_udf: 'User Defined Variable for Loop count (test iterations)',
    loop_count: 'Loop count (test iterations)',
    test_duration_udf: 'User Defined Variable for Test durations (seconds)',
    test_duration: 'Test durations (seconds)',
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
                const fieldValue = jmeterConfig ? jmeterConfig[fieldName] : '';
                let renderedValue;
                if (typeof fieldValue === 'boolean') {
                  renderedValue = fieldValue ? 'Yes' : 'No';
                } else {
                  renderedValue = fieldValue;
                }

                // Only render rows for filled fields
                if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
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
