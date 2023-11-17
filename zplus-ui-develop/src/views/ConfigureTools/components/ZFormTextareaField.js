const ZFormTextareaField = ({ id, label, name, rows, formik }) => {
  return (
    <div className='mb-3'>
      <label
        htmlFor={id}
        className='mb-0 pb-2 form-label'>
        {label}
      </label>
      <textarea
        className='form-control'
        id={id}
        name={name}
        rows={rows}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        style={{ height: `${rows * 1.5}em` }}
      />
    </div>
  );
};

export default ZFormTextareaField;
