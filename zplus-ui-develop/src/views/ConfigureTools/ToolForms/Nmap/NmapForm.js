import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import BreadcrumbContainer from '../../components/BreadcrumbContainer';
import Footer from '../../../../components/Footer';
import { nmapValidationSchema } from './formValidation';
import StepForm from '../../components/StepForm';
import StepNavigation from '../../components/StepNavigation';
import { applyDefaultValues, navigateToNextToolOrPipeline } from '../../helper';
import toolsConfigThunk from '../../../../redux/thunks/toolsConfigThunk';
import { resetSaveConfigStates, updateNmapConfig } from '../../../../redux/slices/toolsConfigSlice';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const NmapForm = () => {
  const [activeStep, setActiveStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentTool = decodeURIComponent(pathname.split('/')[2]);
  const nmapConfig = useSelector((state) => state.toolsConfig.nmapConfig);
  const isConfigSaved = useSelector((state) => state.toolsConfig.isConfigSaved);
  const selectedTools = useSelector((state) => state.toolsDashboard.selectedTools);
  const isLastTool = selectedTools[selectedTools.length - 1] === currentTool;

  const initialValues = {
    step1: applyDefaultValues(nmapConfig, {
      target: '',
      scan_type: '',
      port: '',
      scan_timing: '',
      output_format: '',
    }),
    step2: applyDefaultValues(nmapConfig, {
      aggressive_scan: false,
      script_scan: '',
      traceroute: false,
      show_port_state_reason: false,
      scan_all_ports: false,
      version_detection_intensity: '',
      max_round_trip_timeout: '',
      max_retries: '',
      fragment_packets: false,
      service_version_probe: false,
      default_nse_scripts: false,
    }),
  };

  const formik = useFormik({
    initialValues: initialValues[`step${activeStep}`],
    validationSchema: nmapValidationSchema[`step${activeStep}`],
    onSubmit: (values, { setSubmitting }) => {
      const finalValues = {
        ...initialValues.step2,
        ...values,
      };
      dispatch(toolsConfigThunk.saveToolsConfig({ toolName: currentTool.replace(/\s/g, ''), formData: finalValues }));
    },
  });

  const handleNextClick = (event) => {
    event.preventDefault();
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        if (activeStep === 1) {
          setActiveStep(2);
        } else if (activeStep === 2) {
          setActiveStep(3);
          const finalValues = {
            ...initialValues.step2,
            ...formik.values,
          };
          dispatch(updateNmapConfig(finalValues));
        }
      } else {
        const touchedFields = {};
        Object.keys(formik.values).forEach((field) => {
          touchedFields[field] = true;
        });
        formik.setTouched(touchedFields);
      }
    });
  };

  const handlePreviousClick = (event) => {
    event.preventDefault();
    setActiveStep(activeStep - 1);
  };

  const requiredFields = {
    step1: ['target', 'scan_type', 'port', 'scan_timing', 'output_format'],
    step2: [],
  };

  const isStepComplete = () => {
    const currentStepRequiredFields = requiredFields[`step${activeStep}`];
    const isRequiredFieldsComplete = currentStepRequiredFields.every((field) => !!formik.values[field]);

    return isRequiredFieldsComplete;
  };

  useEffect(() => {
    if (isConfigSaved) {
      navigateToNextToolOrPipeline(navigate, pathname, selectedTools);
      dispatch(resetSaveConfigStates());
    }
  }, [isConfigSaved, navigate, dispatch, pathname, selectedTools]);

  return (
    <div className='app-wrapper'>
      <div className='content pt-3 p-md-3'>
        <div className='container-xl'>
          <BreadcrumbContainer tool='Nmap' />

          <h1 className='app-page-title'>Nmap Tool Configuration</h1>

          <div className='row g-4 mb-4'>
            <div className='col-12 col-lg-12 col-md-12 col-sm-12'>
              <div className='app-card shadow-sm'>
                <div className='app-card-header p-3'>
                  <div className='row justify-content-between align-items-center'>
                    <div className='col-auto'>
                      <h4 className='app-card-title'>Nmap Tool Configuration Form </h4>
                    </div>
                    <div className='col-auto'></div>
                  </div>
                </div>

                <div className='app-card-body px-4 pb-3 pt-3'>
                  <div className='tab-card'>
                    <StepNavigation
                      steps={3}
                      activeStep={activeStep}
                    />

                    <div className='tab-card-body'>
                      <form onSubmit={formik.handleSubmit}>
                        <div className='tab-content text-left'>
                          {activeStep === 1 && <Step1 formik={formik} />}
                          {activeStep === 2 && <Step2 formik={formik} />}
                          {activeStep === 3 && <Step3 />}
                        </div>

                        <StepForm
                          activeStep={activeStep}
                          totalSteps={3}
                          handlePreviousClick={handlePreviousClick}
                          handleNextClick={handleNextClick}
                          isStepComplete={isStepComplete}
                          isLastTool={isLastTool}
                        />
                      </form>
                    </div>
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

export default NmapForm;
