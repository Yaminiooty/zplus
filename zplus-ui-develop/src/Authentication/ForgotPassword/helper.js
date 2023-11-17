import * as Yup from 'yup';
import { CONSTANTS } from '../../utils/constants';

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required.').matches(CONSTANTS.EMAIL_REGEX, 'Enter a valid email address.'),
});
