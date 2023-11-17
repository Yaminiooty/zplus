const StepNavigation = ({ steps, activeStep }) => {
  const stepNames = Array.from({ length: steps }, (_, index) => `Step-${index + 1}`);

  return (
    <div className='tab-card-header'>
      <ul
        className='nav nav-tabs justify-content-left'
        role='tablist'
        id='mytabs'>
        {stepNames.map((step, index) => (
          <li
            className='nav-item'
            key={step}>
            <div
              className={`nav-link ${index + 1 === activeStep ? 'active' : ''}`}
              data-toggle='tab'
              role='tab'>
              {step}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepNavigation;
