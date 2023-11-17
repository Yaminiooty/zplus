import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordValidationSchema } from './helper';
import logo from '../../assets/images/logo.png';
import FormInput from '../components/FormInput';
import authThunks from '../../redux/thunks/authThunk';
import { useEffect } from 'react';
import { resetForgotPasswordStates } from '../../redux/slices/authSlice';
import Modal from '../../components/Modal';

const ForgotPasswordView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEmailSent = useSelector((state) => state.auth.isEmailSent);
  const isForgotPasswordLoading = useSelector((state) => state.auth.isForgotPasswordLoading);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values) => {
      dispatch(authThunks.forgotPassword(values));
    },
  });

  const handleBackToLoginClick = () => {
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (isEmailSent) {
      navigate('/', { replace: true });
      dispatch(resetForgotPasswordStates());
    }
  }, [isEmailSent, navigate, dispatch]);

  return (
    <div className='container-fluid'>
      <Modal
        loading={isForgotPasswordLoading}
        message='Sending reset password link'
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
            <h2 className='sign-in-title'>Forgot Password</h2>
            <form
              onSubmit={formik.handleSubmit}
              noValidate>
              <FormInput
                id='email'
                name='email'
                type='email'
                label='Username'
                placeholder='Please Enter Your Email'
                tabIndex='1'
                error={formik.errors.email}
                touched={formik.touched.email}
                icon='fa-envelope'
                {...formik.getFieldProps('email')}
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
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
