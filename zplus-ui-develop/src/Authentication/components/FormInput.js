const FormInput = ({
  id,
  name,
  type,
  label,
  icon,
  placeholder,
  tabIndex,
  error,
  touched,
  showPassword,
  togglePasswordVisibility,
  ...props
}) => {
  return (
    <div className='form-group mb-3'>
      <label
        htmlFor={id}
        className='pb-1'>
        {label} <span className='text-danger'>*</span>
      </label>
      <div className='input-group'>
        <input
          id={id}
          name={name}
          className={`form-control ${touched && error ? 'is-invalid' : 'border-end-0'}`}
          aria-label={placeholder}
          tabIndex={tabIndex}
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          {...props}
        />
        <span
          className={`input-group-text bg-white border-top border-end border-bottom ${
            type === 'password' ? 'pointer-cursor' : ''
          } ${touched && error ? 'rounded-end-2' : ''}`}
          onClick={togglePasswordVisibility}>
          <i
            className={`fas ${type === 'password' && showPassword ? 'fa-eye' : 'fa-eye-slash'} ${
              type !== 'password' ? icon : ''
            }`}
          />
        </span>
        {touched && error && <div className='invalid-feedback'>{error}</div>}
      </div>
    </div>
  );
};

export default FormInput;
