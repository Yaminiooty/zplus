import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import authThunks from '../../redux/thunks/authThunk';
import Modal from '../../components/Modal';
import { resetAccountVerificationStates } from '../../redux/slices/authSlice';

const EmailVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.userEmail);
  const isAccountVerified = useSelector((state) => state.auth.isAccountVerified);
  const isAccountVerifiedLoading = useSelector((state) => state.auth.isAccountVerifiedLoading);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRefs = useRef([]);
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleOtpChange = (event, index) => {
    const { value } = event.target;
    const newOtpValues = [...otp];

    if (value === '') {
      // Handle Backspace
      if (index > 0) {
        newOtpValues[index - 1] = '';
        setActiveOTPIndex(index - 1);
      }
    } else {
      // Handle input
      newOtpValues[index] = value.substring(value.length - 1);
      setActiveOTPIndex(index < 5 ? index + 1 : 5);
    }

    setOtp(newOtpValues);
  };

  const handleOnKeyDown = (event, index) => {
    if (event.code === 'Backspace') {
      event.preventDefault();
      if (index > 0) {
        const newOtpValues = [...otp];
        newOtpValues[index] = '';
        setOtp(newOtpValues);
        setActiveOTPIndex(index > 0 ? index - 1 : 0);
      }
    }
  };

  const handleVerifyClick = () => {
    const verificationCode = {
      email: userEmail,
      code: parseInt(otp.join('')),
    };
    dispatch(authThunks.verifyAccount(verificationCode));
  };

  const handleRequestAgain = () => {
    const userData = {
      email: userEmail,
    };
    dispatch(authThunks.getVerificationCode(userData));
  };

  useEffect(() => {
    inputRefs.current[activeOTPIndex]?.focus();
    const allFieldsFilled = otp.every((val) => val !== '');
    setIsButtonActive(allFieldsFilled);

    if (isAccountVerified) {
      navigate('/', { replace: true });
      dispatch(resetAccountVerificationStates());
    }
  }, [activeOTPIndex, otp, isAccountVerified, navigate, dispatch]);

  return (
    <div className='container-fluid'>
      <Modal
        loading={isAccountVerifiedLoading}
        message='Verifying email'
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
                alt='Logo'
              />
            </div>
            <h2 className='sign-in-title'>Email Verification</h2>
            <p>Your code was sent to you via email</p>
            <form>
              <div className='form-group'>
                <div className='otp-field mb-4'>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type='number'
                      value={value}
                      maxLength='1'
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      onChange={(event) => handleOtpChange(event, index)}
                      onKeyDown={(event) => handleOnKeyDown(event, index)}
                      disabled={value === '' && index !== activeOTPIndex}
                    />
                  ))}
                </div>
              </div>
              <div className='d-flex btn-gap mt-4'>
                <button
                  type='button'
                  className={`btn btn-next w-25 ${isButtonActive ? 'active' : ''}`}
                  onClick={handleVerifyClick}
                  disabled={!isButtonActive}>
                  Verify
                </button>
              </div>
              <p className='resend text-muted mb-0'>
                Didn't receive code? <Link onClick={handleRequestAgain}>Request again</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
