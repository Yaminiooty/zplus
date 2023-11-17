import * as Yup from 'yup';
import { CONSTANTS } from '../../utils/constants';

export const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password too short!')
    .required('Password is required.')
    .matches(
      CONSTANTS.PASSWORD_REGEX,
      'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character.'
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required.')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match.'),
});
