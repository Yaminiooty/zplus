import Header from '../../components/Header';
import Banner from '../../components/Banner';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import * as Yup from 'yup';
import { breadcrumbData } from './data';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userThunk from '../../redux/thunks/userThunk';
import { useFormik } from 'formik';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { CountrySelectWithIcon, CustomContainer } from './CustomPhoneField';
import useToggle from '../../hooks/useToggle';
import { CONSTANTS } from '../../utils/constants';
import { resetFetchStates, resetUpdateStates } from '../../redux/slices/userSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const [disabledForm, setDisabledForm] = useToggle(true);
  const isFetchingDetails = useSelector((state) => state.user.isFetchingDetails);
  const isDetailsFetched = useSelector((state) => state.user.isDetailsFetched);
  const isUpdatingDetails = useSelector((state) => state.user.isUpdatingDetails);
  const isDetailsUpdated = useSelector((state) => state.user.isDetailsUpdated);
  const userDetails = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    dispatch(userThunk.getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (isDetailsUpdated) {
      setDisabledForm(true);
      dispatch(resetFetchStates());
      dispatch(resetUpdateStates());
    }
  }, [dispatch, isDetailsUpdated, setDisabledForm]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Name is required.')
        .matches(CONSTANTS.NAME_REGEX, 'Name can only contain letters and spaces.'),
      phone: Yup.string()
        .required('Phone number is required.')
        .test('phone validation', 'Invalid phone number', (value) => {
          return isValidPhoneNumber(value);
        }),
    }),
    onSubmit: (values) => {
      dispatch(userThunk.updateUserDetails(values));
    },
  });

  const initializeFormik = useCallback((userData) => {
    // Initialize formik with user data
    formik.setValues({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
    });
  }, []);

  useEffect(() => {
    if (isDetailsFetched) {
      initializeFormik(userDetails);
    }
  }, [initializeFormik, userDetails, isDetailsFetched, setDisabledForm]);

  const handleEditProfile = () => {
    setDisabledForm(!disabledForm);
  };
  const handleCancel = () => {
    initializeFormik(userDetails);
    setDisabledForm(true);
  };

  return (
    <div className='page-container'>
      <Modal
        loading={isFetchingDetails}
        message='Fetching user details'
      />

      <Modal
        loading={isUpdatingDetails}
        message='Updating user details'
      />

      <Header />
      <Banner />
      <Breadcrumb breadcrumbData={breadcrumbData} />

      <div className='container-fluid wrapper content mb-3'>
        <div className='row g-2'>
          <div className='col-md-4 col-lg-3 col-sm-12 col-12'>
            <div className='card border-0 h-100'>
              <div className='card-body border-0'>
                <div className='text-center'>
                  <i className='fas fa-user-circle fa-4x'></i>
                  <h3 className='user-name'>{userDetails?.name}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-8 col-lg-9 col-sm-12 col-12'>
            <div className='card border-0'>
              <div className='card-body p-4 border-0'>
                <div className='row d-flex align-content-center'>
                  <div className='col-md-6 col-6'>
                    <h3 className='user-name'>User Profile</h3>
                  </div>
                  <div
                    className='col-md-6 col-6 text-end no-select'
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditProfile}>
                    <i className='fas fa-edit'></i> Edit Profile
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12 col-lg-6 col-sm-12 col-12'>
                    <form
                      onSubmit={formik.handleSubmit}
                      noValidate>
                      <div className='form-group mb-3'>
                        <label
                          htmlFor='name'
                          className='form-label mb-0 no-select'>
                          Name
                        </label>
                        <input
                          id='name'
                          name='name'
                          type='text'
                          className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                          disabled={disabledForm}
                          {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className='invalid-feedback'>{formik.errors.name}</div>
                        )}
                      </div>

                      <div className='form-group mb-3'>
                        <label
                          htmlFor='email'
                          className='form-label mb-0 no-select'>
                          Username
                        </label>
                        <input
                          id='email'
                          name='email'
                          type='text'
                          className='form-control no-select'
                          disabled={formik.values.email}
                          {...formik.getFieldProps('email')}
                        />
                      </div>

                      <div className='form-group mb-3'>
                        <label
                          htmlFor='phone'
                          className='pb-1 no-select'>
                          Phone Number
                        </label>
                        <div>
                          <PhoneInput
                            containerComponent={CustomContainer}
                            countrySelectComponent={CountrySelectWithIcon}
                            international
                            countryCallingCodeEditable={false}
                            placeholder='Enter phone number'
                            value={formik.values.phone}
                            onChange={(value) => formik.setFieldValue('phone', value)}
                            onBlur={formik.handleBlur('phone')}
                            disabled={disabledForm}
                          />
                        </div>
                        {formik.touched.phone && formik.errors.phone && (
                          <div className={`${formik.touched.phone && formik.errors.phone ? 'error' : ''}`}>
                            {formik.errors.phone}
                          </div>
                        )}
                      </div>

                      <div className='d-flex btn-gap mt-4'>
                        <button
                          type='button'
                          className='btn btn-back w-50'
                          disabled={disabledForm}
                          onClick={handleCancel}>
                          Cancel
                        </button>
                        <button
                          type='submit'
                          className='btn btn-next w-50'
                          disabled={disabledForm}>
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
