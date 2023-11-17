import * as Yup from 'yup';

export const metasploitValidationSchema = {
  step1: Yup.object({
    module_type: Yup.string().required('Module Type is required.').oneOf(['auxiliary'], 'Invalid value.'),
    module_fullname: Yup.string().required('Module fullname is required.'),
    use_default_values: Yup.boolean(),
    advanced_options: Yup.boolean(),
    additional_comments: Yup.string(),
  }),
};
