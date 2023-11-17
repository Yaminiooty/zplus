import ZFormInputField from '../../components/ZFormInputField';
import ZFormSelectField from '../../components/ZFormSelectField';
import ZFormCheckboxField from '../../components/ZFormCheckboxField';
import ZFormTextareaField from '../../components/ZFormTextareaField';

const selectFieldOptions = {
  output_format: [
    { value: '', label: 'Select Output Format' },
    { value: 'HTML', label: 'HTML' },
    { value: 'JSON', label: 'JSON' },
    { value: 'XML', label: 'XML' },
  ],
};

const Step1 = ({ formik }) => {
  const formFields = {
    left: [
      {
        id: 'project_file',
        label: 'Project File (ZIP):',
        name: 'project_file',
        type: 'file',
        accept: '.zip',
        component: ZFormInputField,
      },
      {
        id: 'output_format',
        label: 'Output Format:',
        name: 'output_format',
        options: selectFieldOptions.output_format,
        component: ZFormSelectField,
      },
      {
        id: 'scan_dependencies',
        label: 'Perform Dependency Scanning',
        name: 'scan_dependencies',
        component: ZFormCheckboxField,
      },
      {
        id: 'scan_dev_dependencies',
        label: 'Include Development Dependencies',
        name: 'scan_dev_dependencies',
        component: ZFormCheckboxField,
      },
      {
        id: 'suppress_update_check',
        label: 'Suppress Update Checks',
        name: 'suppress_update_check',
        component: ZFormCheckboxField,
      },
    ],
    right: [
      {
        id: 'suppress_cve_reports',
        label: 'Suppress CVE Reports',
        name: 'suppress_cve_reports',
        component: ZFormCheckboxField,
        clearFields: ['suppress_cve_reports_file'],
      },
      {
        id: 'suppress_cve_reports_file',
        label: 'CVE Report File (ZIP):',
        name: 'suppress_cve_reports_file',
        type: 'file',
        accept: '.zip',
        component: ZFormInputField,
        disabled: !formik.values.suppress_cve_reports,
      },
      {
        id: 'additional_comments',
        label: 'Additional Comments',
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
              accept={field.accept}
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
              accept={field.accept}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1;
