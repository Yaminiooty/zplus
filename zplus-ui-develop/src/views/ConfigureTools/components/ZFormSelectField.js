const ZFormSelectField = ({ id, label, name, formik, options, disabled, onChangeCallback }) => {
  const handleOnChange = (event) => {
    formik.handleChange(event);

    if (onChangeCallback) {
      onChangeCallback(event);
    }
  };

  return (
    <div className='mb-3'>
      <label
        htmlFor={id}
        className='mb-0 pb-2 form-label'>
        {label}
      </label>
      <select
        id={id}
        name={name}
        className={`form-select ${formik.touched[name] && formik.errors[name] ? 'is-invalid' : ''}`}
        onChange={handleOnChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        disabled={disabled}>
        {options.map((option, index) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.value === ''}>
            {option.label}
          </option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] ? (
        <div className='invalid-feedback'>{formik.errors[name]}</div>
      ) : null}
    </div>
  );
};

export default ZFormSelectField;
