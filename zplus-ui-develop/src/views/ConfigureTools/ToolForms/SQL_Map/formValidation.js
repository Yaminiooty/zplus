import * as Yup from 'yup';

export const sqlMapValidationSchema = {
  step1: Yup.object({
    target: Yup.string().required('Target is required.'),
    testing_mode: Yup.string().required('Testing mode is required.').oneOf(['Automatic', 'Manual'], 'Invalid value.'),
    testing_level: Yup.string()
      .required('Testing level is required.')
      .oneOf(['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'], 'Invalid value.'),
    verbosity_level: Yup.string()
      .required('Verbosity level is required.')
      .oneOf(['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6'], 'Invalid value.'),
    test_forms: Yup.boolean(),
    check_for_additional_urls: Yup.boolean(),
    cookies: Yup.string(),
    headers: Yup.string(),
    data: Yup.string(),
    user_agent: Yup.string(),
    number_of_threads: Yup.string()
      .required('Number of threads is required.')
      .oneOf(['Low', 'Medium', 'High'], 'Invalid value.'),
    exclude_system_databases: Yup.boolean(),
    current_session_user: Yup.boolean(),
    current_database: Yup.boolean(),
    enumerate_users: Yup.boolean(),
    enumerate_passwords: Yup.boolean(),
    enumerate_privileges: Yup.boolean(),
    enumerate_roles: Yup.boolean(),
    enumerate_databases: Yup.boolean(),
    enumerate_tables: Yup.boolean(),
    enumerate_columns: Yup.boolean(),
    enumerate_schemas: Yup.boolean(),
    report_format: Yup.string().required('Report format is required.').oneOf(['PDF', 'TXT'], 'Invalid value.'),
    additional_comments: Yup.string(),
  }),
};
