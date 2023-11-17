import ZFormInputField from '../../components/ZFormInputField';
import ZFormSelectField from '../../components/ZFormSelectField';
import ZFormTextareaField from '../../components/ZFormTextareaField';

const selectFieldOptions = {
  report_format: [
    { value: '', label: 'Select Report Format' },
    { value: 'HTML', label: 'HTML' },
  ],
};

const formFields = {
  left: [
    {
      id: 'test_plan_file',
      label: 'Test Plan File (JMX):',
      name: 'test_plan_file',
      type: 'file',
      accept: '.jmx',
      component: ZFormInputField,
    },
    {
      id: 'number_of_threads_udf',
      label: 'User Defined Variable for Number of Threads (Concurrent Users):',
      name: 'number_of_threads_udf',
      type: 'text',
      placeholder: 'Enter User Defined Variable for Number of Threads',
      component: ZFormInputField,
    },
    {
      id: 'number_of_threads',
      label: 'Number of Threads (Concurrent Users):',
      name: 'number_of_threads',
      type: 'text',
      placeholder: 'Enter Number of Threads',
      component: ZFormInputField,
    },
    {
      id: 'ramp_up_period_udf',
      label: 'User Defined Variable for Ramp-Up Period (seconds):',
      name: 'ramp_up_period_udf',
      type: 'text',
      placeholder: 'Enter User Defined Variable for Ramp-Up Period',
      component: ZFormInputField,
    },
    {
      id: 'ramp_up_period',
      label: 'Ramp-Up Period (seconds):',
      name: 'ramp_up_period',
      type: 'text',
      placeholder: 'Enter Ramp-Up Period',
      component: ZFormInputField,
    },
    {
      id: 'loop_count_udf',
      label: 'User Defined Variable for Loop Count (Test Iterations):',
      name: 'loop_count_udf',
      type: 'text',
      placeholder: 'Enter User Defined Variable for Loop Count',
      component: ZFormInputField,
    },
    {
      id: 'loop_count',
      label: 'Loop Count (Test Iterations):',
      name: 'loop_count',
      type: 'text',
      placeholder: 'Enter Loop Count',
      component: ZFormInputField,
    },
  ],

  right: [
    {
      id: 'test_duration_udf',
      label: 'Test Duration (seconds):',
      name: 'test_duration_udf',
      type: 'text',
      placeholder: 'Enter User Defined Variable for Test Duration',
      component: ZFormInputField,
    },
    {
      id: 'test_duration',
      label: 'Test Duration (seconds):',
      name: 'test_duration',
      type: 'text',
      placeholder: 'Enter Test Duration',
      component: ZFormInputField,
    },
    {
      id: 'report_format',
      label: 'Report Format:',
      name: 'report_format',
      options: selectFieldOptions.report_format,
      component: ZFormSelectField,
    },
    {
      id: 'additional_comments',
      label: 'Additional Comments:',
      name: 'additional_comments',
      rows: '4',
      component: ZFormTextareaField,
    },
  ],
};

const Step1 = ({ formik }) => {
  return (
    <div
      id='home'
      role='tabpanel'>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6 col-12'>
          {formFields.left.map((field) => (
            <field.component
              key={field.id}
              id={field.id}
              label={field.label}
              name={field.name}
              type={field.type}
              formik={formik}
              options={field.options}
              placeholder={field.placeholder}
              accept={field.accept}
              disabled={field.disabled}
              rows={field.rows}
              clearFields={field.clearFields}
              onChangeCallback={field.onChangeCallback}
            />
          ))}
        </div>

        <div className='col-sm-12 col-md-6 col-lg-6 col-12'>
          {formFields.right.map((field) => (
            <field.component
              key={field.id}
              id={field.id}
              label={field.label}
              name={field.name}
              type={field.type}
              formik={formik}
              options={field.options}
              placeholder={field.placeholder}
              disabled={field.disabled}
              rows={field.rows}
              clearFields={field.clearFields}
              onChangeCallback={field.onChangeCallback}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1;
