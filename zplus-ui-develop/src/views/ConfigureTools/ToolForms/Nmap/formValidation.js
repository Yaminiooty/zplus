import * as Yup from 'yup';

export const nmapValidationSchema = {
  step1: Yup.object({
    target: Yup.string().required('Target is required.'),
    scan_type: Yup.string()
      .required('Scan Type is required.')
      .oneOf(['SYN Scan', 'TCP Connect Scan', 'UDP Scan', 'Comprehensive Scan'], 'Invalid value.'),
    port: Yup.string().required('Port Range is required.'),
    scan_timing: Yup.string()
      .required('Scan Timing is required.')
      .oneOf(['Slowest', 'Slow', 'Normal', 'Fast', 'Fastest'], 'Invalid value.'),
    output_format: Yup.string()
      .required('Output Format is required.')
      .oneOf(['XML', 'Normal', 'Grepable'], 'Invalid value.'),
  }),
  step2: Yup.object().shape({
    aggressive_scan: Yup.boolean(),
    script_scan: Yup.string().oneOf(['Vulnerability Scripts', 'Default Scripts', 'Custom Scripts'], 'Invalid value.'),
    traceroute: Yup.boolean(),
    show_port_state_reason: Yup.boolean(),
    scan_all_ports: Yup.boolean(),
    version_detection_intensity: Yup.string().oneOf(['Low', 'Medium', 'High'], 'Invalid value.'),
    max_round_trip_timeout: Yup.string(),
    max_retries: Yup.string(),
    fragment_packets: Yup.boolean(),
    service_version_probe: Yup.boolean(),
    default_nse_scripts: Yup.boolean(),
  }),
};
