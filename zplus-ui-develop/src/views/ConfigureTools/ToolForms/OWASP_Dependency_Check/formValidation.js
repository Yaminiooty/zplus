import * as Yup from 'yup';

export const owaspDependencyCheckValidationSchema = {
  step1: Yup.object({
    project_file: Yup.mixed()
      .required('Project file is required.')
      .test('fileType', 'Invalid file type. Please upload .zip file.', (value) => {
        if (!value) return true;
        const supportedFormats = ['zip'];
        const fileExtension = value.name.split('.').pop().toLowerCase();
        return supportedFormats.includes(fileExtension);
      }),
    output_format: Yup.string().required('Output format is required.').oneOf(['HTML', 'JSON', 'XML'], 'Invalid value.'),
    scan_dependencies: Yup.boolean(),
    scan_dev_dependencies: Yup.boolean(),
    suppress_update_check: Yup.boolean(),
    suppress_cve_reports: Yup.boolean(),
    suppress_cve_reports_file: Yup.mixed().when(['suppress_cve_reports'], (suppressCVEReports, schema) => {
      return suppressCVEReports.toString() === 'true'
        ? schema.required('CVE Reports file is required.').test('fileType', 'Invalid file type', (value) => {
            if (!value) return true;
            const supportedFormats = ['zip'];
            const fileExtension = value.name.split('.').pop().toLowerCase();
            return supportedFormats.includes(fileExtension);
          })
        : schema;
    }),
    additional_comments: Yup.string(),
  }),
};
