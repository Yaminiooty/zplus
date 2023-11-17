const StepForm = ({ activeStep, totalSteps, handlePreviousClick, handleNextClick, isStepComplete, isLastTool }) => {
  return (
    <div className='row'>
      <div className='col-md-12 text-end'>
        {activeStep !== 1 && (
          <button
            className='btn btn-back btn-sm btnPrevious me-2'
            onClick={handlePreviousClick}>
            <i className='fa-solid fa-angle-left'></i> Previous
          </button>
        )}
        {activeStep !== totalSteps && (
          <button
            className='btn btn-next btn-sm btnNext ms-2'
            disabled={activeStep !== totalSteps && !isStepComplete()}
            onClick={handleNextClick}>
            Next <i className='fa-solid fa-angle-right'></i>
          </button>
        )}
        {activeStep === totalSteps && (
          <button
            type='submit'
            className='btn btn-next btn-sm btnNext ms-2'>
            {isLastTool ? 'Review configuration' : 'Move to next Tool'}
            <i className='fa-solid fa-angle-right'></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default StepForm;
