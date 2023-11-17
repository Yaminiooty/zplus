import * as Yup from 'yup';
import { CONSTANTS } from '../../utils/constants';

export const signInValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required.').matches(CONSTANTS.EMAIL_REGEX, 'Enter a valid email address.'),
  password: Yup.string().min(8, 'Password too short!').required('Password is required.'),
});
