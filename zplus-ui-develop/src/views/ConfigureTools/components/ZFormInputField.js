import { useDispatch, useSelector } from 'react-redux';
import { setFile } from '../../../redux/slices/toolsConfigSlice';

const ZFormInputField = ({ id, label, name, type, formik, placeholder, accept, disabled, required }) => {
  const isFileInput = type === 'file';
  const dispatch = useDispatch();
  const selectedFile = useSelector((state) => state.toolsConfig[name]);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    dispatch(setFile({ fieldName: name, fileName: file ? file.name : '' }));
    formik.setFieldValue(name, file || '');
  };

  return (
    <div className='mb-3'>
      <label
        htmlFor={id}
        className='mb-0 pb-2 form-label'>
        {label}
      </label>
      {isFileInput ? (
        <input
          style={{ height: '36px' }}
          type={type}
          className={`form-control px-2 py-1 ${formik.touched[name] && formik.errors[name] ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          onChange={handleFileChange}
          onBlur={formik.handleBlur}
          accept={accept}
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          type={type}
          className={`form-control ${formik.touched[name] && formik.errors[name] ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          disabled={disabled}
          required={required}
        />
      )}
      {selectedFile ? (
        <div
          className='mt-0 p-1 ps-2'
          style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <span style={{ fontWeight: 'bold' }}>Selected file: </span>
          {selectedFile}
        </div>
      ) : null}
      {formik.touched[name] && formik.errors[name] ? (
        <div className='invalid-feedback'>{formik.errors[name]}</div>
      ) : null}
    </div>
  );
};

export default ZFormInputField;
