import * as Yup from 'yup';

export const jmeterValidationSchema = {
  step1: Yup.object({
    test_plan_file: Yup.mixed()
      .required('Test plan file is required.')
      .test('fileType', 'Invalid file type. Please upload .jmx file.', (value) => {
        if (!value) return true;
        const supportedFormats = ['jmx'];
        const fileExtension = value.name.split('.').pop().toLowerCase();
        return supportedFormats.includes(fileExtension);
      }),
    number_of_threads_udf: Yup.string().required('User Defined Variable for Number of threads is required.'),
    number_of_threads: Yup.string().required('Number of threads is required.'),
    ramp_up_period_udf: Yup.string().required('User Defined Variable for Ramp-up period is required.'),
    ramp_up_period: Yup.string().required('Ramp-up period is required.'),
    loop_count_udf: Yup.string().required('User Defined Variable for Loop count is required.'),
    loop_count: Yup.string().required('Loop count is required.'),
    test_duration_udf: Yup.string().required('User Defined Variable for Test duration is required.'),
    test_duration: Yup.string().required('Test duration is required.'),
    report_format: Yup.string().required('Report format is required.').oneOf(['HTML'], 'Invalid value.'),
    additional_comments: Yup.string(),
  }),
};
