import * as Yup from 'yup';
import { CONSTANTS } from '../../utils/constants';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required.')
    .matches(CONSTANTS.NAME_REGEX, 'Name can only contain letters and spaces.'),
  email: Yup.string().required('Email is required.').matches(CONSTANTS.EMAIL_REGEX, 'Enter a valid email address.'),
  phone: Yup.string()
    .required('Phone number is required.')
    .test('phone validation', 'Invalid phone number', (value) => {
      return isValidPhoneNumber(value);
    }),
  password: Yup.string()
    .min(8, 'Password too short!')
    .required('Password is required.')
    .matches(
      CONSTANTS.PASSWORD_REGEX,
      'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character.'
    ),
  confirmPassword: Yup.string()
    .required('Password is required.')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match.'),
  termsAcceptanceStatus: Yup.boolean().oneOf([true], 'You must accept the terms and conditions.'),
});
