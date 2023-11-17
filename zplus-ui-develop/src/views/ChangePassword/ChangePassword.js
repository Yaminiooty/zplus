import Header from '../../components/Header';
import Banner from '../../components/Banner';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import * as Yup from 'yup';
import { breadcrumbData } from './data';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userThunk from '../../redux/thunks/userThunk';
import { useFormik } from 'formik';
import { CONSTANTS } from '../../utils/constants';
import { resetFetchStates, resetPasswordStates } from '../../redux/slices/userSlice';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const isFetchingDetails = useSelector((state) => state.user.isFetchingDetails);
  const isUpdatingPassword = useSelector((state) => state.user.isUpdatingPassword);
  const isPasswordUpdated = useSelector((state) => state.user.isPasswordUpdated);
  const userDetails = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    dispatch(userThunk.getUserDetails());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
    validationSchema: Yup.object().shape({
      old_password: Yup.string()
        .min(8, 'Password too short!')
        .required('Current Password is required.')
        .matches(
          CONSTANTS.PASSWORD_REGEX,
          'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character.'
        ),
      new_password: Yup.string()
        .min(8, 'Password too short!')
        .required('New Password is required.')
        .matches(
          CONSTANTS.PASSWORD_REGEX,
          'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character.'
        ),
      confirm_new_password: Yup.string()
        .required('Confirm New Password is required.')
        .oneOf([Yup.ref('new_password'), null], 'Passwords do not match.'),
    }),
    onSubmit: (values) => {
      const { confirm_new_password, ...data } = values;
      dispatch(userThunk.changePassword(data));
    },
  });

  useEffect(() => {
    if (isPasswordUpdated) {
      formik.resetForm();
      dispatch(resetFetchStates());
      dispatch(resetPasswordStates());
    }
  }, [dispatch, isPasswordUpdated]);

  const handleCancel = () => {
    formik.resetForm();
  };

  return (
    <div className='page-container'>
      <Modal
        loading={isFetchingDetails}
        message='Fetching user details'
      />

      <Modal
        loading={isUpdatingPassword}
        message='Updating password'
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
                    <h3 className='user-name'>Change Password</h3>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12 col-lg-6 col-sm-12 col-12'>
                    <form
                      onSubmit={formik.handleSubmit}
                      noValidate>
                      <div className='form-group mb-3'>
                        <label
                          htmlFor='old_password'
                          className='form-label mb-0'>
                          Current Password
                        </label>
                        <input
                          id='old_password'
                          name='old_password'
                          type='password'
                          className={`form-control ${
                            formik.touched.old_password && formik.errors.old_password ? 'is-invalid' : ''
                          }`}
                          placeholder='Enter Current Password'
                          {...formik.getFieldProps('old_password')}
                        />
                        {formik.touched.old_password && formik.errors.old_password && (
                          <div className='invalid-feedback'>{formik.errors.old_password}</div>
                        )}
                      </div>

                      <div className='form-group mb-3'>
                        <label
                          htmlFor='new_password'
                          className='form-label mb-0'>
                          New Password
                        </label>
                        <input
                          id='new_password'
                          name='new_password'
                          type='password'
                          className={`form-control ${
                            formik.touched.new_password && formik.errors.new_password ? 'is-invalid' : ''
                          }`}
                          placeholder='Enter New Password'
                          {...formik.getFieldProps('new_password')}
                        />
                        {formik.touched.new_password && formik.errors.new_password && (
                          <div className='invalid-feedback'>{formik.errors.new_password}</div>
                        )}
                      </div>

                      <div className='form-group mb-3'>
                        <label
                          htmlFor='confirm_new_password'
                          className='form-label mb-0'>
                          Confirm New Password
                        </label>
                        <input
                          id='confirm_new_password'
                          name='confirm_new_password'
                          type='password'
                          className={`form-control ${
                            formik.touched.confirm_new_password && formik.errors.confirm_new_password
                              ? 'is-invalid'
                              : ''
                          }`}
                          placeholder='Enter New Password'
                          {...formik.getFieldProps('confirm_new_password')}
                        />
                        {formik.touched.confirm_new_password && formik.errors.confirm_new_password && (
                          <div className='invalid-feedback'>{formik.errors.confirm_new_password}</div>
                        )}
                      </div>

                      <div className='d-flex btn-gap'>
                        <button
                          type='button'
                          className='btn btn-back w-50'
                          onClick={handleCancel}>
                          Cancel
                        </button>
                        <button
                          type='submit'
                          className='btn btn-next w-50'>
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

export default ChangePassword;
