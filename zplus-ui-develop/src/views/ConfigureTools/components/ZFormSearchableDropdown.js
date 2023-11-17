import Select from 'react-select';

const ZFormSearchableDropdown = ({ id, label, name, formik, options, placeholder, onChangeCallback, disabled }) => {
  const handleChange = (selectedOption) => {
    formik.setFieldValue(name, selectedOption.value);

    if (onChangeCallback) {
      onChangeCallback(selectedOption);
    }
  };

  const handleBlur = () => {
    formik.setFieldTouched(name, true);
  };

  return (
    <div className='mb-3'>
      <label
        htmlFor={id}
        className='mb-0 pb-2 form-label'>
        {label}
      </label>
      <Select
        id={id}
        name={name}
        className={`${formik.touched[name] && formik.errors[name] ? 'is-invalid' : ''}`}
        options={options}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        isDisabled={disabled}
      />
      {formik.touched[name] && formik.errors[name] ? (
        <div className='invalid-feedback'>{formik.errors[name]}</div>
      ) : null}
    </div>
  );
};

export default ZFormSearchableDropdown;
