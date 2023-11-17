import * as Yup from 'yup';

export const owaspZapValidationSchema = {
  step1: Yup.object({
    target: Yup.string().required('Target is required.'),
    scan_type: Yup.string().required('Scan type is required.').oneOf(['Passive Scan', 'Active Scan'], 'Invalid value.'),
    spider_type: Yup.string()
      .required('Spider type is required.')
      .oneOf(['Traditional Spider', 'Ajax Spider'], 'Invalid Value.'),
    max_children: Yup.number().when(['spider_type'], (spiderType, schema) => {
      return spiderType.toString() === 'Traditional Spider'
        ? schema
            .required('Max Children is required for Traditional Spider.')
            .integer('Must be an integer')
            .min(1, 'Must be at least 1')
        : schema;
    }),
    recurse: Yup.boolean(),
    sub_tree_only: Yup.boolean(),
    attack_mode: Yup.string()
      .required('Attack mode is required.')
      .oneOf(['Safe Mode', 'Standard Mode', 'Protected Mode', 'Attack Mode'], 'Invalid value.'),
    authentication: Yup.boolean(),
    login_url: Yup.string().when(['authentication'], (authentication, schema) => {
      return authentication.toString() === 'true'
        ? schema.required('Login URL is required for authentication.')
        : schema;
    }),
    username_parameter: Yup.string().when(['authentication'], (authentication, schema) => {
      return authentication.toString() === 'true'
        ? schema.required('Username parameter is required for authentication.')
        : schema;
    }),
    password_parameter: Yup.string().when(['authentication'], (authentication, schema) => {
      return authentication.toString() === 'true'
        ? schema.required('Password parameter is required for authentication.')
        : schema;
    }),
    username: Yup.string().when(['authentication'], (authentication, schema) => {
      return authentication.toString() === 'true'
        ? schema.required('Username is required for authentication.')
        : schema;
    }),
    password: Yup.string().when(['authentication'], (authentication, schema) => {
      return authentication.toString() === 'true'
        ? schema.required('Password is required for authentication.')
        : schema;
    }),
    logged_in_indicator: Yup.string().when(['authentication'], (authentication, schema) => {
      return authentication.toString() === 'true'
        ? schema.required('Password is required for authentication.')
        : schema;
    }),
    policy_template: Yup.string()
      .required('Policy template is required.')
      .oneOf(['Low', 'Medium', 'High'], 'Invalid value.'),
    report_format: Yup.string().required('Report format is required.').oneOf(['PDF', 'HTML'], 'Invalid value.'),
    additional_comments: Yup.string(),
  }),
};
