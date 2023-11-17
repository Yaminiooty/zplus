import ZFormInputField from '../../components/ZFormInputField';
import ZFormSelectField from '../../components/ZFormSelectField';
import ZFormCheckboxField from '../../components/ZFormCheckboxField';
import ZFormTextareaField from '../../components/ZFormTextareaField';

const selectFieldOptions = {
  scan_type: [
    { value: '', label: 'Select Scan Type' },
    { value: 'Passive Scan', label: 'Passive Scan' },
    { value: 'Active Scan', label: 'Active Scan' },
  ],
  spider_type: [
    { value: '', label: 'Select Spider Type' },
    { value: 'Traditional Spider', label: 'Traditional Spider' },
    { value: 'Ajax Spider', label: 'AJAX Spider' },
  ],
  attack_mode: [
    { value: '', label: 'Select Attack Mode' },
    { value: 'Safe Mode', label: 'Safe Mode' },
    { value: 'Standard Mode', label: 'Standard Mode' },
    { value: 'Protected Mode', label: 'Protected Mode' },
    { value: 'Attack Mode', label: 'Attack Mode' },
  ],
  policy_template: [
    { value: '', label: 'Select Policy Template' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ],
  report_format: [
    { value: '', label: 'Select Report Format' },
    { value: 'PDF', label: 'PDF' },
    { value: 'HTML', label: 'HTML' },
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
        placeholder: 'Enter Target URL',
        component: ZFormInputField,
      },
      {
        id: 'scan_type',
        label: 'Scan Type:',
        name: 'scan_type',
        options: selectFieldOptions.scan_type,
        component: ZFormSelectField,
      },
      {
        id: 'spider_type',
        label: 'Spider Type:',
        name: 'spider_type',
        options: selectFieldOptions.spider_type,
        component: ZFormSelectField,
        onChangeCallback: (event) => {
          if (event.target.value === 'Ajax Spider') {
            formik.setFieldValue('max_children', '');
            formik.setFieldTouched('max_children', false);
            formik.setFieldError('max_children', '');
          }
        },
      },
      {
        id: 'max_children',
        label: 'Max Children:',
        name: 'max_children',
        type: 'number',
        placeholder: 'Enter Max Children',
        component: ZFormInputField,
        disabled: formik.values.spider_type !== 'Traditional Spider',
      },
      {
        id: 'recurse',
        label: 'Recurse',
        name: 'recurse',
        component: ZFormCheckboxField,
        disabled: formik.values.spider_type !== 'Traditional Spider',
      },
      {
        id: 'sub_tree_only',
        label: 'Sub Tree Only',
        name: 'sub_tree_only',
        component: ZFormCheckboxField,
        disabled: formik.values.spider_type !== 'Traditional Spider',
      },
      {
        id: 'attack_mode',
        label: 'Attack Mode:',
        name: 'attack_mode',
        options: selectFieldOptions.attack_mode,
        component: ZFormSelectField,
      },
      {
        id: 'policy_template',
        label: 'Policy Template:',
        name: 'policy_template',
        options: selectFieldOptions.policy_template,
        component: ZFormSelectField,
      },
      {
        id: 'report_format',
        label: 'Report Format:',
        name: 'report_format',
        options: selectFieldOptions.report_format,
        component: ZFormSelectField,
      },
    ],
    right: [
      {
        id: 'authentication',
        label: 'Enable authentication',
        name: 'authentication',
        component: ZFormCheckboxField,
        clearFields: [
          'login_url',
          'username_parameter',
          'password_parameter',
          'username',
          'password',
          'logged_in_indicator',
        ],
      },
      {
        id: 'login_url',
        label: 'Login URL:',
        name: 'login_url',
        type: 'text',
        placeholder: 'Enter Login URL',
        component: ZFormInputField,
        disabled: !formik.values.authentication,
      },
      {
        id: 'username_parameter',
        label: 'Username Parameter:',
        name: 'username_parameter',
        type: 'text',
        placeholder: 'Enter Username Parameter',
        component: ZFormInputField,
        disabled: !formik.values.authentication,
      },
      {
        id: 'password_parameter',
        label: 'Password Parameter:',
        name: 'password_parameter',
        type: 'text',
        placeholder: 'Enter Password Parameter',
        component: ZFormInputField,
        disabled: !formik.values.authentication,
      },
      {
        id: 'username',
        label: 'Username:',
        name: 'username',
        type: 'text',
        placeholder: 'Enter Username',
        component: ZFormInputField,
        disabled: !formik.values.authentication,
      },
      {
        id: 'password',
        label: 'Password:',
        name: 'password',
        type: 'password',
        placeholder: 'Enter Password',
        component: ZFormInputField,
        disabled: !formik.values.authentication,
      },
      {
        id: 'logged_in_indicator',
        label: 'Logged In Indicator:',
        name: 'logged_in_indicator',
        type: 'text',
        placeholder: 'Enter Logged In Indicator',
        component: ZFormInputField,
        disabled: !formik.values.authentication,
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
