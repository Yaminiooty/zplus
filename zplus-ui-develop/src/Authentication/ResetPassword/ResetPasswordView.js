import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordValidationSchema } from './helper';
import logo from '../../assets/images/logo.png';
import FormInput from '../components/FormInput';
import useToggle from '../../hooks/useToggle';
import authThunks from '../../redux/thunks/authThunk';
import { useEffect } from 'react';
import { resetResetPasswordStates } from '../../redux/slices/authSlice';
import Modal from '../../components/Modal';

const ResetPasswordView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isPasswordUpdated = useSelector((state) => state.auth.isPasswordUpdated);
  const isResetPasswordLoading = useSelector((state) => state.auth.isResetPasswordLoading);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, togglePasswordVisibility] = useToggle(false);
  const [showConfirmPassword, toggleConfirmPasswordVisibility] = useToggle(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      const { confirmPassword, ...password } = values;
      const credentials = {
        ...password,
        token,
      };

      dispatch(authThunks.resetPassword(credentials));
    },
  });

  const handleBackToLoginClick = () => {
    navigate('/');
  };

  useEffect(() => {
    if (isPasswordUpdated) {
      navigate('/');
      dispatch(resetResetPasswordStates());
    }
  }, [isPasswordUpdated, navigate, dispatch]);

  return (
    <div className='container-fluid'>
      <Modal
        loading={isResetPasswordLoading}
        message='Updating password'
      />
      <div className='row'>
        <div className='col-sm-6 col-md-6 intro-section'></div>
        <div
          className='col-sm-6 col-md-6 form-section'
          style={{ backgroundColor: 'white' }}>
          <div className='login-wrapper'>
            <div className='col-md-12 col-sm-12 mb-4 mt-sm-2 mt-lg-0'>
              <img
                src={logo}
                width='250'
                alt='logo'
              />
            </div>
            <h2 className='sign-in-title'>Reset Password</h2>
            <form
              onSubmit={formik.handleSubmit}
              noValidate>
              <FormInput
                id='password'
                name='password'
                type='password'
                label='New Password'
                placeholder='Please Enter Your New Password'
                tabIndex='1'
                error={formik.errors.password}
                touched={formik.touched.password}
                {...formik.getFieldProps('password')}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />

              <FormInput
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                label='Confirm New Password'
                placeholder='Please Enter Your New Password'
                tabIndex='1'
                error={formik.errors.confirmPassword}
                touched={formik.touched.confirmPassword}
                showPassword={showConfirmPassword}
                togglePasswordVisibility={toggleConfirmPasswordVisibility}
                {...formik.getFieldProps('confirmPassword')}
              />

              <div className='d-flex btn-gap mt-4'>
                <button
                  type='button'
                  className='btn btn-back w-50'
                  onClick={handleBackToLoginClick}>
                  Back to Login
                </button>

                <button
                  type='submit'
                  className='btn btn-next w-50'>
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordView;
