import { useDispatch } from 'react-redux';
import { setFile } from '../../../redux/slices/toolsConfigSlice';

const ZFormCheckboxField = ({ id, label, name, formik, disabled, clearFields = [] }) => {
  const dispatch = useDispatch();

  const handleOnChange = (event) => {
    formik.handleChange(event);
    if (!event.target.checked && clearFields.length > 0) {
      clearFields.forEach((fieldName) => {
        formik.setFieldValue(fieldName, '');
        formik.setFieldTouched(fieldName, false);
        formik.setFieldError(fieldName, '');

        dispatch(setFile({ fieldName: fieldName, fileName: '' }));
      });
    }
  };

  return (
    <div className='mb-1 form-check'>
      <input
        type='checkbox'
        className='form-check-input'
        id={id}
        name={name}
        onChange={handleOnChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        checked={formik.values[name]}
        disabled={disabled}
      />
      <label
        className='mt-2 form-check-label'
        htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default ZFormCheckboxField;
