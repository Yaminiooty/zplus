import ZFormInputField from '../../components/ZFormInputField';
import ZFormSelectField from '../../components/ZFormSelectField';
import ZFormTextareaField from '../../components/ZFormTextareaField';

const selectFieldOptions = {
  scan_config: [
    { value: '', label: 'Select Scan Config' },
    { value: 'empty', label: 'Empty' },
    { value: 'Base', label: 'Base' },
    { value: 'Discovery', label: 'Discovery' },
    { value: 'Full and fast', label: 'Full and Fast' },
    { value: 'Host Discovery', label: 'Host Discovery' },
    { value: 'Log4Shell', label: 'Log4Shell' },
    { value: 'System Discovery', label: 'System Discovery' },
  ],

  scanner_type: [
    { value: '', label: 'Select Scanner Type' },
    { value: 'OpenVAS Default', label: 'OpenVASDefault' },
    { value: 'CVE', label: 'CVE' },
  ],

  report_format: [
    { value: '', label: 'Select Report Format' },
    { value: 'XML', label: 'XML' },
    { value: 'PDF', label: 'PDF' },
    { value: 'TEXT', label: 'TXT' },
  ],
};

const Step1 = ({ formik }) => {
  const formFields = {
    left: [
      {
        id: 'target',
        label: 'Target IP/Hostname:',
        name: 'target',
        type: 'text',
        placeholder: 'Enter Target',
        component: ZFormInputField,
      },
      {
        id: 'tcp',
        label: 'Scan Port Range (TCP):',
        name: 'tcp',
        type: 'text',
        placeholder: 'Enter Scan Port Range (TCP)',
        component: ZFormInputField,
      },
      {
        id: 'udp',
        label: 'Scan Port Range (UDP):',
        name: 'udp',
        type: 'text',
        placeholder: 'Enter Scan Port Range (UDP)',
        component: ZFormInputField,
      },
      {
        id: 'scanner_type',
        label: 'Scanner Type:',
        name: 'scanner_type',
        options: selectFieldOptions.scanner_type,
        component: ZFormSelectField,
      },
      {
        id: 'scan_config',
        label: 'Scan Config:',
        name: 'scan_config',
        options: selectFieldOptions.scan_config,
        component: ZFormSelectField,
      },
    ],
    right: [
      {
        id: 'no_of_concurrent_nvt_per_host',
        label: 'Number of Concurrent NVT Per Host:',
        name: 'no_of_concurrent_nvt_per_host',
        type: 'number',
        placeholder: 'Enter Number of Concurrent NVT Per Host',
        component: ZFormInputField,
      },
      {
        id: 'no_of_concurrent_scanned_host',
        label: 'Number of Concurrent Scanned Host:',
        name: 'no_of_concurrent_scanned_host',
        type: 'number',
        placeholder: 'Enter Number of Concurrent Scanned Host',
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
