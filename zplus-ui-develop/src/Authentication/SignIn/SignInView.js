import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../components/FormInput';
import useToggle from '../../hooks/useToggle';
import { signInValidationSchema } from './helper';
import logo from '../../assets/images/logo.png';
import authThunks from '../../redux/thunks/authThunk';
import { useEffect } from 'react';
import { resetLoginStates, setUserEmail } from '../../redux/slices/authSlice';
import Modal from '../../components/Modal';

const SignInView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isVerificationError = useSelector((state) => state.auth.isVerificationError);
  const isLoginLoading = useSelector((state) => state.auth.isLoginLoading);
  const [showPassword, togglePasswordVisibility] = useToggle(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInValidationSchema,
    onSubmit: (values) => {
      const { email } = values;
      dispatch(setUserEmail(email));
      dispatch(authThunks.login(values));
    },
  });

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      dispatch(resetLoginStates());
    }
    if (isVerificationError) {
      navigate('/email-verification');
      dispatch(resetLoginStates());
    }
  }, [isAuthenticated, isVerificationError, navigate, dispatch]);

  return (
    <div className='container-fluid'>
      <Modal
        loading={isLoginLoading}
        message='Verifying credentials'
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
            <h2 className='sign-in-title'>Sign in</h2>
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

              <FormInput
                id='password'
                name='password'
                type='password'
                label='Password'
                placeholder='Please Enter Your Password'
                tabIndex='2'
                error={formik.errors.password}
                touched={formik.touched.password}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                {...formik.getFieldProps('password')}
              />

              <div className='d-flex btn-gap mt-4'>
                <button
                  type='button'
                  className='btn btn-back w-50'
                  onClick={handleForgotPasswordClick}>
                  Forgot Password?
                </button>
                <button
                  type='submit'
                  className='btn btn-next w-50'>
                  Login
                </button>
              </div>
            </form>

            <div className='register-wrapper'>
              <div className='register-title'>New User</div>
              <p className='register-info'>If you are a first time user, click below on “Register Now”.</p>
              <button
                type='button'
                className='btn btn-next w-50'
                onClick={handleRegisterClick}>
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInView;
