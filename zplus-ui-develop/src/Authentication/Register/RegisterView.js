import { useFormik } from 'formik';
import { registerValidationSchema } from './helper';
import logo from '../../assets/images/logo.png';
import FormInput from '../components/FormInput';
import useToggle from '../../hooks/useToggle';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authThunks from '../../redux/thunks/authThunk';
import { resetRegisterStates, setUserEmail } from '../../redux/slices/authSlice';
import { CountrySelectWithIcon, CustomContainer } from './CustomPhoneField';
import Modal from '../../components/Modal';
import PhoneInput from 'react-phone-number-input';

const RegisterView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isUserRegistered = useSelector((state) => state.auth.isUserRegistered);
  const isUserRegisterLoading = useSelector((state) => state.auth.isUserRegisterLoading);
  const [showPassword, togglePasswordVisibility] = useToggle(false);
  const [showConfirmPassword, toggleConfirmPasswordVisibility] = useToggle(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAcceptanceStatus: false,
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...formData } = values;

      const { email } = formData;
      dispatch(setUserEmail(email));
      dispatch(authThunks.registerUser(formData));
    },
  });

  useEffect(() => {
    if (isUserRegistered) {
      navigate('/email-verification', { replace: true });
      dispatch(resetRegisterStates());
    }
  }, [isUserRegistered, navigate, dispatch]);

  return (
    <div className='container-fluid'>
      <Modal
        loading={isUserRegisterLoading}
        message='Registering user'
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
            <h2 className='sign-in-title'>Register</h2>
            <form
              onSubmit={formik.handleSubmit}
              noValidate>
              <FormInput
                id='name'
                name='name'
                type='text'
                label='Name'
                placeholder='Please Enter Your Name'
                tabIndex='1'
                error={formik.errors.name}
                touched={formik.touched.name}
                icon='fa-user'
                {...formik.getFieldProps('name')}
              />

              <FormInput
                id='email'
                name='email'
                type='email'
                label='Username'
                placeholder='Please Enter Your Email'
                tabIndex='2'
                error={formik.errors.email}
                touched={formik.touched.email}
                icon='fa-envelope'
                {...formik.getFieldProps('email')}
              />

              <div className='form-group mb-3'>
                <label
                  htmlFor='phone'
                  className='pb-1'>
                  Phone Number <span className='text-danger'>*</span>
                </label>
                <div className='input-group'>
                  {/* <IntlTelInput
                    fieldId='phone'
                    fieldName='phone'
                    containerClassName='intl-tel-input'
                    inputClassName='form-control rounded-end-0 border-end-0'
                    separateDialCode={true}
                    defaultCountry='in'
                    value={phoneNumber}
                    onPhoneNumberChange={handlePhoneNumberChange}
                    placeholder='Please Enter Your Phone Number'
                  /> */}

                  <PhoneInput
                    containerComponent={CustomContainer}
                    countrySelectComponent={CountrySelectWithIcon}
                    international
                    defaultCountry='IN'
                    countryCallingCodeEditable={false}
                    placeholder='Enter phone number'
                    value={formik.values.phone}
                    onChange={(value) => formik.setFieldValue('phone', value)}
                    onBlur={formik.handleBlur('phone')}
                  />

                  <span className='input-group-text bg-white border-top border-end border-bottom'>
                    <i className='fas fa-mobile-alt'></i>
                  </span>
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <div className={`${formik.touched.phone && formik.errors.phone ? 'error' : ''}`}>
                    {formik.errors.phone}
                  </div>
                )}
              </div>

              <FormInput
                id='password'
                name='password'
                type='password'
                label='Password'
                placeholder='Please Enter Your Password'
                tabIndex='4'
                error={formik.errors.password}
                touched={formik.touched.password}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                {...formik.getFieldProps('password')}
              />

              <FormInput
                id='confirmPassowrd'
                name='confirmPassword'
                type='password'
                label='Confirm Password'
                placeholder='Please Enter Your Confirm Password'
                tabIndex='5'
                error={formik.errors.confirmPassword}
                touched={formik.touched.confirmPassword}
                showPassword={showConfirmPassword}
                togglePasswordVisibility={toggleConfirmPasswordVisibility}
                {...formik.getFieldProps('confirmPassword')}
              />

              <div className='form-check'>
                <input
                  id='termsAcceptanceStatus'
                  name='termsAcceptanceStatus'
                  className='form-check-input'
                  tabIndex='6'
                  type='checkbox'
                  checked={formik.values.termsAcceptanceStatus}
                  onChange={formik.handleChange}
                />
                <label
                  htmlFor='termsAcceptanceStatus'
                  style={{ marginTop: '0.75rem' }}>
                  I accept the HPE Terms of Use and Privacy Policy.
                </label>
                {formik.touched.termsAcceptanceStatus && formik.errors.termsAcceptanceStatus && (
                  <div className='text-danger'>{formik.errors.termsAcceptanceStatus}</div>
                )}
              </div>

              <div className='d-flex btn-gap mt-4'>
                <button
                  type='submit'
                  className='btn btn-next w-100'>
                  Register
                </button>
              </div>
              <p className='pt-4'>
                You Already Have An Account? <Link to='/'>Login Here.</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
