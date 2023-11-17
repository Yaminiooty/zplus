import ZFormInputField from '../../components/ZFormInputField';
import ZFormSelectField from '../../components/ZFormSelectField';
import ZFormCheckboxField from '../../components/ZFormCheckboxField';
import ZFormTextareaField from '../../components/ZFormTextareaField';

const selectFieldOptions = {
  testing_mode: [
    { value: '', label: 'Select Testing Mode' },
    { value: 'Automatic', label: 'Automatic (Use automatic detection)' },
    { value: 'Manual', label: 'Manual (Specify parameters manually)' },
  ],

  testing_level: [
    { value: '', label: 'Select Testing Level' },
    { value: 'Level 1', label: 'Level 1' },
    { value: 'Level 2', label: 'Level 2' },
    { value: 'Level 3', label: 'Level 3' },
    { value: 'Level 4', label: 'Level 4' },
    { value: 'Level 5', label: 'Level 5' },
  ],

  verbosity_level: [
    { value: '', label: 'Select Verbosity Level' },
    { value: 'Level 0', label: 'Level 1' },
    { value: 'Level 1', label: 'Level 2' },
    { value: 'Level 2', label: 'Level 3' },
    { value: 'Level 3', label: 'Level 4' },
    { value: 'Level 4', label: 'Level 5' },
    { value: 'Level 5', label: 'Level 6' },
    { value: 'Level 6', label: 'Level 7' },
  ],

  number_of_threads: [
    { value: '', label: 'Select Number of Threads' },
    { value: 'Low', label: 'Low (-t 2)' },
    { value: 'Medium', label: 'Medium (-t 5)' },
    { value: 'High', label: 'High (-t 10)' },
  ],

  report_format: [
    { value: '', label: 'Select Report Format' },
    { value: 'PDF', label: 'PDF' },
    { value: 'TXT', label: 'TEXT' },
  ],
};

const Step1 = ({ formik }) => {
  const formFields = {
    left: [
      {
        id: 'target',
        label: 'Target URL:',
        name: 'target',
        type: 'text',
        placeholder: 'Enter Target',
        component: ZFormInputField,
      },
      {
        id: 'testing_mode',
        label: 'Testing Mode:',
        name: 'testing_mode',
        options: selectFieldOptions.testing_mode,
        component: ZFormSelectField,
        onChangeCallback: (event) => {
          if (event.target.value === 'Automatic') {
            formik.setFieldValue('current_session_user', false);
            formik.setFieldValue('current_database', false);
            formik.setFieldValue('enumerate_users', false);
            formik.setFieldValue('enumerate_passwords', false);
            formik.setFieldValue('enumerate_privileges', false);
            formik.setFieldValue('enumerate_roles', false);
            formik.setFieldValue('enumerate_databases', false);
            formik.setFieldValue('enumerate_tables', false);
            formik.setFieldValue('enumerate_columns', false);
            formik.setFieldValue('enumerate_schemas', false);
          }
        },
      },
      {
        id: 'testing_level',
        label: 'Testing Level:',
        name: 'testing_level',
        options: selectFieldOptions.testing_level,
        component: ZFormSelectField,
      },
      {
        id: 'verbosity_level',
        label: 'Verbosity Level:',
        name: 'verbosity_level',
        options: selectFieldOptions.verbosity_level,
        component: ZFormSelectField,
      },
      {
        id: 'test_forms',
        label: 'Test Forms on target URL',
        name: 'test_forms',
        component: ZFormCheckboxField,
      },
      {
        id: 'check_for_additional_urls',
        label: 'Check for additional URLs',
        name: 'check_for_additional_urls',
        component: ZFormCheckboxField,
      },
      {
        id: 'cookies',
        label: 'Cookies:',
        name: 'cookies',
        type: 'text',
        placeholder: 'Enter Cookies',
        component: ZFormInputField,
      },
      {
        id: 'headers',
        label: 'Headers:',
        name: 'headers',
        type: 'text',
        placeholder: 'Enter Headers',
        component: ZFormInputField,
      },
      {
        id: 'data',
        label: 'Data:',
        name: 'data',
        type: 'text',
        placeholder: 'Enter Data',
        component: ZFormInputField,
      },
      {
        id: 'user_agent',
        label: 'User-Agent:',
        name: 'user_agent',
        type: 'text',
        placeholder: 'Enter User Agent',
        component: ZFormInputField,
      },
    ],

    right: [
      {
        id: 'number_of_threads',
        label: 'Number of Threads:',
        name: 'number_of_threads',
        options: selectFieldOptions.number_of_threads,
        component: ZFormSelectField,
      },
      {
        id: 'exclude_system_databases',
        label: 'Exclude system databases',
        name: 'exclude_system_databases',
        component: ZFormCheckboxField,
      },

      {
        id: 'current_session_user',
        label: 'Current session user',
        name: 'current_session_user',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'current_database',
        label: 'Current database',
        name: 'current_database',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_users',
        label: 'Enumerate DBMS users',
        name: 'enumerate_users',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_passwords',
        label: 'Enumerate DBMS users password hashes',
        name: 'enumerate_passwords',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_privileges',
        label: 'Enumerate DBMS users privileges',
        name: 'enumerate_privileges',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_roles',
        label: 'Enumerate DBMS users roles',
        name: 'enumerate_roles',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_databases',
        label: 'Enumerate DBMS databases',
        name: 'enumerate_databases',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_tables',
        label: 'Enumerate DBMS database tables',
        name: 'enumerate_tables',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_columns',
        label: 'Enumerate DBMS database table columns',
        name: 'enumerate_columns',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
      },
      {
        id: 'enumerate_schemas',
        label: 'Enumerate DBMS schema',
        name: 'enumerate_schemas',
        component: ZFormCheckboxField,
        disabled: formik.values.testing_mode !== 'Manual',
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
              rows={field.rows}
              disabled={field.disabled}
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
