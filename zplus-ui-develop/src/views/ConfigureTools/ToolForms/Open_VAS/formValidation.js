import * as Yup from 'yup';

export const openVasValidationSchema = {
  step1: Yup.object({
    target: Yup.string().required('Target is required.'),
    tcp: Yup.string().required('Scan Port Range (TCP) is required.'),
    udp: Yup.string().required('Scan Port Range (UDP) is required.'),
    scanner_type: Yup.string()
      .required('Scanner Type is required.')
      .oneOf(['OpenVAS Default', 'CVE'], 'Invalid value.'),
    scan_config: Yup.string()
      .required('Scan Config is required.')
      .oneOf(
        ['Base', 'Discovery', 'empty', 'Full and fast', 'Host Discovery', 'Log4Shell', 'System Discovery'],
        'Invalid value.'
      ),
    no_of_concurrent_nvt_per_host: Yup.number()
      .required('No. of Concurrent NVTs per host is required.')
      .integer('Must be an integer')
      .min(1, 'Must be at least 1'),
    no_of_concurrent_scanned_host: Yup.number()
      .required('No. of concurrent Scanned host is required.')
      .integer('Must be an integer')
      .min(1, 'Must be at least 1'),
    report_format: Yup.string().required('Report Format is required.').oneOf(['XML', 'PDF', 'TEXT'], 'Invalid value.'),
    additional_comments: Yup.string(),
  }),
};
