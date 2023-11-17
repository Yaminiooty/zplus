import ZFormInputField from '../../components/ZFormInputField';
import ZFormSelectField from '../../components/ZFormSelectField';
import ZFormCheckboxField from '../../components/ZFormCheckboxField';

const selectFieldOptionsStep2 = {
  script_scan: [
    { value: '', label: 'Select Script Scan' },
    { value: 'Vulnerability Scripts', label: 'Vulnerability Scripts' },
    { value: 'Default Scripts', label: 'Default Scripts' },
    { value: 'Custom Scripts', label: 'Custom Scripts' },
  ],
  version_detection_intensity: [
    { value: '', label: 'Select Version Detection Intensity' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ],
};

const Step2 = ({ formik }) => {
  const formFields = {
    left: [
      {
        id: 'aggressive_scan',
        label: 'Aggressive Scan',
        name: 'aggressive_scan',
        component: ZFormCheckboxField,
      },
      {
        id: 'script_scan',
        label: 'Script Scan:',
        name: 'script_scan',
        options: selectFieldOptionsStep2.script_scan,
        component: ZFormSelectField,
      },
      {
        id: 'traceroute',
        label: 'Traceroute',
        name: 'traceroute',
        component: ZFormCheckboxField,
      },
      {
        id: 'show_port_state_reason',
        label: 'Show Port State Reason',
        name: 'show_port_state_reason',
        component: ZFormCheckboxField,
      },
      {
        id: 'scan_all_ports',
        label: 'Scan All Ports',
        name: 'scan_all_ports',
        component: ZFormCheckboxField,
      },
      {
        id: 'version_detection_intensity',
        label: 'Version Detection Intensity:',
        name: 'version_detection_intensity',
        options: selectFieldOptionsStep2.version_detection_intensity,
        component: ZFormSelectField,
      },
    ],
    right: [
      {
        id: 'max_round_trip_timeout',
        label: 'Max Round Trip Timeout:',
        name: 'max_round_trip_timeout',
        type: 'text',
        placeholder: 'Enter Max Round-Trip Timeout',
        component: ZFormInputField,
      },
      {
        id: 'max_retries',
        label: 'Max Retries:',
        name: 'max_retries',
        type: 'text',
        placeholder: 'Enter Max Retries',
        component: ZFormInputField,
      },
      {
        id: 'fragment_packets',
        label: 'Fragment Packets',
        name: 'fragment_packets',
        component: ZFormCheckboxField,
      },
      {
        id: 'service_version_probe',
        label: 'Service Version Probe',
        name: 'service_version_probe',
        component: ZFormCheckboxField,
      },
      {
        id: 'default_nse_scripts',
        label: 'Default NSE Scripts',
        name: 'default_nse_scripts',
        component: ZFormCheckboxField,
      },
    ],
  };
  return (
    <div
      id='step-2'
      role='tabpanel'>
      <h4 className='app-card-title'>Additional Options</h4>
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

export default Step2;
