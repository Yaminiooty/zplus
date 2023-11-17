import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import BreadcrumbContainer from '../../components/BreadcrumbContainer';
import Footer from '../../../../components/Footer';
import { jmeterValidationSchema } from './formValidation';
import StepForm from '../../components/StepForm';
import StepNavigation from '../../components/StepNavigation';
import { applyDefaultValues, navigateToNextToolOrPipeline } from '../../helper';
import { resetSaveConfigStates, updateJMeterConfig } from '../../../../redux/slices/toolsConfigSlice';
import Step1 from './Step1';
import Step2 from './Step2';
import toolsConfigThunk from '../../../../redux/thunks/toolsConfigThunk';

const JMeterForm = () => {
  const [activeStep, setActiveStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentTool = decodeURIComponent(pathname.split('/')[2]);
  const isConfigSaved = useSelector((state) => state.toolsConfig.isConfigSaved);
  const jmeterConfig = useSelector((state) => state.toolsConfig.jmeterConfig);
  const selectedTools = useSelector((state) => state.toolsDashboard.selectedTools);
  const isLastTool = selectedTools[selectedTools.length - 1] === currentTool;

  const initialValues = {
    step1: applyDefaultValues(jmeterConfig, {
      test_plan_file: null,
      number_of_threads_udf: '',
      number_of_threads: '',
      ramp_up_period_udf: '',
      ramp_up_period: '',
      loop_count_udf: '',
      loop_count: '',
      test_duration_udf: '',
      test_duration: '',
      report_format: '',
      additional_comments: '',
    }),
  };

  const formik = useFormik({
    initialValues: initialValues[`step${activeStep}`],
    validationSchema: jmeterValidationSchema[`step${activeStep}`],
    onSubmit: (values) => {
      dispatch(toolsConfigThunk.saveToolsConfig({ toolName: currentTool.replace(/\s/g, ''), formData: values }));
    },
  });

  const handleNextClick = (event) => {
    event.preventDefault();
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        if (activeStep === 1) {
          setActiveStep(2);
          const formikValues = { ...formik.values };
          const testPlanFileName = formikValues.test_plan_file.name;

          // Remove the test_plan_file property and replace it with the name
          delete formikValues.test_plan_file;
          formikValues.test_plan_file = testPlanFileName;

          dispatch(updateJMeterConfig(formikValues));
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
    step1: [
      'test_plan_file',
      'number_of_threads_udf',
      'number_of_threads',
      'ramp_up_period_udf',
      'ramp_up_period',
      'loop_count_udf',
      'loop_count',
      'test_duration_udf',
      'test_duration',
      'report_format',
    ],
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
          <BreadcrumbContainer tool='JMeter Load Testing' />

          <h1 className='app-page-title'>JMeter Load Testing Tool Configuration</h1>

          <div className='row g-4 mb-4'>
            <div className='col-12 col-lg-12 col-md-12 col-sm-12'>
              <div className='app-card shadow-sm'>
                <div className='app-card-header p-3'>
                  <div className='row justify-content-between align-items-center'>
                    <div className='col-auto'>
                      <h4 className='app-card-title'>JMeter Load Testing Tool Configuration Form </h4>
                    </div>
                    <div className='col-auto'></div>
                  </div>
                </div>

                <div className='app-card-body px-4 pt-3 pb-3'>
                  <div className='tab-card'>
                    <StepNavigation
                      steps={2}
                      activeStep={activeStep}
                    />

                    <div className='tab-card-body'>
                      <form onSubmit={formik.handleSubmit}>
                        <div className='tab-content text-left'>
                          {activeStep === 1 && <Step1 formik={formik} />}
                          {activeStep === 2 && <Step2 />}
                        </div>

                        <StepForm
                          activeStep={activeStep}
                          totalSteps={2}
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

export default JMeterForm;
