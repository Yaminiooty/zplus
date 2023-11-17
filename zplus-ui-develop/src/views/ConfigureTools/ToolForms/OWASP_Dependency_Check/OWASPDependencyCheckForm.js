import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import BreadcrumbContainer from '../../components/BreadcrumbContainer';
import Footer from '../../../../components/Footer';
import { owaspDependencyCheckValidationSchema } from './formValidation';
import StepForm from '../../components/StepForm';
import StepNavigation from '../../components/StepNavigation';
import { applyDefaultValues, navigateToNextToolOrPipeline } from '../../helper';
import toolsConfigThunk from '../../../../redux/thunks/toolsConfigThunk';
import { resetSaveConfigStates, updateOWASPDependencyCheckConfig } from '../../../../redux/slices/toolsConfigSlice';
import Step1 from './Step1';
import Step2 from './Step2';

const OWASPDependencyCheckForm = () => {
  const [activeStep, setActiveStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentTool = decodeURIComponent(pathname.split('/')[2]);
  const isConfigSaved = useSelector((state) => state.toolsConfig.isConfigSaved);
  const owaspDependencyCheckConfig = useSelector((state) => state.toolsConfig.owaspDependencyCheckConfig);
  const selectedTools = useSelector((state) => state.toolsDashboard.selectedTools);
  const isLastTool = selectedTools[selectedTools.length - 1] === currentTool;

  const initialValues = {
    step1: applyDefaultValues(owaspDependencyCheckConfig, {
      project_file: null,
      output_format: '',
      scan_dependencies: false,
      scan_dev_dependencies: false,
      suppress_update_check: false,
      suppress_cve_reports: false,
      suppress_cve_reports_file: undefined,
      additional_comments: '',
    }),
  };

  const formik = useFormik({
    initialValues: initialValues[`step${activeStep}`],
    validationSchema: owaspDependencyCheckValidationSchema[`step${activeStep}`],
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
          const projectFileName = formikValues.project_file.name;

          if (formikValues.suppress_cve_reports) {
            const cveReportFileName = formikValues.suppress_cve_reports_file.name;
            delete formikValues.suppress_cve_reports_file;
            formikValues.suppress_cve_reports_file = cveReportFileName;
          }

          // Remove the project_file property and replace it with the name
          delete formikValues.project_file;
          formikValues.project_file = projectFileName;
          dispatch(updateOWASPDependencyCheckConfig(formikValues));
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
    step1: ['project_file', 'output_format'],
  };

  const isStepComplete = () => {
    const currentStepRequiredFields = requiredFields[`step${activeStep}`];
    const isRequiredFieldsComplete = currentStepRequiredFields.every((field) => !!formik.values[field]);

    if (formik.values.suppress_cve_reports) {
      return isRequiredFieldsComplete && !!formik.values.suppress_cve_reports_file;
    } else {
      return isRequiredFieldsComplete;
    }
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
          <BreadcrumbContainer tool='OWASP Dependency-Check' />

          <h1 className='app-page-title'>OWASP Dependency-Check Tool Configuration</h1>

          <div className='row g-4 mb-4'>
            <div className='col-12 col-lg-12 col-md-12 col-sm-12'>
              <div className='app-card shadow-sm'>
                <div className='app-card-header p-3'>
                  <div className='row justify-content-between align-items-center'>
                    <div className='col-auto'>
                      <h4 className='app-card-title'>OWASP Dependency-Check Tool Configuration Form </h4>
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

export default OWASPDependencyCheckForm;
