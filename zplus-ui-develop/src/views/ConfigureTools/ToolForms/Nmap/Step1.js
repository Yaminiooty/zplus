import ZFormInputField from '../../components/ZFormInputField';
import ZFormSelectField from '../../components/ZFormSelectField';

const selectFieldOptionsStep1 = {
  scan_type: [
    { value: '', label: 'Select Scan Type' },
    { value: 'SYN Scan', label: 'SYN Scan' },
    { value: 'TCP Connect Scan', label: 'TCP Connect Scan' },
    { value: 'UDP Scan', label: 'UDP Scan' },
    { value: 'Comprehensive Scan', label: 'Comprehensive Scan' },
  ],
  scan_timing: [
    { value: '', label: 'Select Scan Timing' },
    { value: 'Slowest', label: 'Slowest' },
    { value: 'Slow', label: 'Slow' },
    { value: 'Normal', label: 'Normal' },
    { value: 'Fast', label: 'Fast' },
    { value: 'Fastest', label: 'Fastest' },
  ],
  output_format: [
    { value: '', label: 'Select Output Format' },
    { value: 'XML', label: 'XML' },
    { value: 'Normal', label: 'Normal' },
    { value: 'Grepable', label: 'Grepable' },
  ],
};

const Step1 = ({ formik }) => {
  const formFields = {
    left: [
      {
        id: 'target',
        label: 'Target(s):',
        name: 'target',
        type: 'text',
        placeholder: 'Enter Target(s)',
        component: ZFormInputField,
      },
      {
        id: 'scan_type',
        label: 'Scan Type:',
        name: 'scan_type',
        options: selectFieldOptionsStep1.scan_type,
        component: ZFormSelectField,
      },
      {
        id: 'port',
        label: 'Port Range:',
        name: 'port',
        type: 'text',
        placeholder: 'Enter Port Range',
        component: ZFormInputField,
      },
    ],
    right: [
      {
        id: 'scan_timing',
        label: 'Scan Timing:',
        name: 'scan_timing',
        options: selectFieldOptionsStep1.scan_timing,
        component: ZFormSelectField,
      },
      {
        id: 'output_format',
        label: 'Output Formats:',
        name: 'output_format',
        options: selectFieldOptionsStep1.output_format,
        component: ZFormSelectField,
      },
    ],
  };
  return (
    <div
      id='step-1'
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
