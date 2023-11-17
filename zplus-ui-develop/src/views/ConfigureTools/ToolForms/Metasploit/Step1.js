import ZFormSelectField from '../../components/ZFormSelectField';
import ZFormTextareaField from '../../components/ZFormTextareaField';
import ZFormSearchableDropdown from '../../components/ZFormSearchableDropdown';
import { useDispatch, useSelector } from 'react-redux';
import toolsConfigThunk from '../../../../redux/thunks/toolsConfigThunk';

const selectFieldOptions = {
  module_type: [
    { value: '', label: 'Select Module Type' },
    { value: 'auxiliary', label: 'Auxiliary' },
  ],
};

const Step1 = ({ formik }) => {
  const dispatch = useDispatch();
  const metasploitModules = useSelector((state) => state.toolsConfig.metasploitModules);
  const isMetasploitModules = useSelector((state) => state.toolsConfig.isMetasploitModules);
  const metasploitModulesOptions = useSelector((state) => state.toolsConfig.metasploitModulesOptions);

  const formFields = {
    left: [
      {
        id: 'module_type',
        label: 'Module Type:',
        name: 'module_type',
        options: selectFieldOptions.module_type,
        component: ZFormSelectField,
        onChangeCallback: (event) => {
          dispatch(toolsConfigThunk.getMetasploitModules({ search_field: event.target.value }));
        },
      },
      {
        id: 'module_fullname',
        label: 'Module Name:',
        name: 'module_fullname',
        placeholder: 'Select Module Name',
        options: metasploitModules,
        disabled: !isMetasploitModules,
        component: ZFormSearchableDropdown,
        onChangeCallback: (selectedOption) => {
          dispatch(
            toolsConfigThunk.getMetasploitModulesOptions({
              module_type: formik.values.module_type,
              module_name: selectedOption.value,
            })
          );
        },
      },
    ],
    right: [
      {
        id: 'additional_comments',
        label: 'Additional Comments:',
        name: 'additional_comments',
        rows: '4',
        component: ZFormTextareaField,
      },
    ],
  };

  const applyDefaultFieldValues = () => {
    metasploitModulesOptions.forEach((field) => {
      if (field.default) {
        formik.setFieldValue(field.name, field.default);
      }
    });
  };

  const clearDefaultFieldValues = () => {
    metasploitModulesOptions.forEach((field) => {
      if (field.default) {
        formik.setFieldValue(field.name, '');
      }
    });
  };

  const clearAdvancedFieldValues = () => {
    metasploitModulesOptions?.forEach((field) => {
      if (field.advanced && !field.required) {
        formik.setFieldValue(field.name, '');
      }
    });
  };

  return (
    <div
      id='step1'
      role='tabpanel'>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6 col-12'>
          {formFields.left.map((field) => (
            <field.component
              key={field.id}
              id={field.id}
              label={field.label}
              name={field.name}
              type={field.type}
              formik={formik}
              options={field.options}
              placeholder={field.placeholder}
              disabled={field.disabled}
              rows={field.rows}
              clearFields={field.clearFields}
              onChangeCallback={field.onChangeCallback}
            />
          ))}

          {metasploitModulesOptions && (
            <div className='mb-1 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='use_default_values'
                name='use_default_values'
                onChange={(e) => {
                  formik.handleChange(e);
                  if (e.target.checked) {
                    applyDefaultFieldValues();
                  } else {
                    clearDefaultFieldValues();
                  }
                }}
                onBlur={formik.handleBlur}
                value={formik.values.use_default_values}
                checked={formik.values.use_default_values}
              />
              <label
                className='mt-2 form-check-label'
                htmlFor='use_default_values'>
                Use Default Values
              </label>
            </div>
          )}

          {metasploitModulesOptions?.map(
            (field) =>
              field.required === true && (
                <div
                  key={field.id}
                  className='mb-3'>
                  <label
                    htmlFor={field.id}
                    className='mb-0 pb-2 form-label'>
                    {field.name}:
                  </label>
                  <input
                    type='text'
                    className={`form-control`}
                    id={field.id}
                    name={field.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field.name]}
                    placeholder={`Please enter ${field.name}`}
                    disabled={formik.values.use_default_values && field.default}
                  />
                </div>
              )
          )}
        </div>

        <div className='col-sm-12 col-md-6 col-lg-6 col-12'>
          {formFields.right.map((field) => (
            <field.component
              key={field.id}
              id={field.id}
              label={field.label}
              name={field.name}
              type={field.type}
              formik={formik}
              options={field.options}
              placeholder={field.placeholder}
              rows={field.rows}
              disabled={field.disabled}
              clearFields={field.clearFields}
              onChangeCallback={field.onChangeCallback}
            />
          ))}

          {metasploitModulesOptions && (
            <div className='mb-1 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='advanced_options'
                name='advanced_options'
                onChange={(e) => {
                  formik.handleChange(e);
                  if (!e.target.checked) {
                    clearAdvancedFieldValues();
                  }
                }}
                onBlur={formik.handleBlur}
                value={formik.values.advanced_options}
                checked={formik.values.advanced_options}
              />
              <label
                className='mt-2 form-check-label'
                htmlFor='advanced_options'>
                Show Advanced Options
              </label>
            </div>
          )}

          {formik.values.advanced_options &&
            metasploitModulesOptions?.map(
              (field) =>
                field.advanced === true &&
                field.required === false && (
                  <div
                    key={field.id}
                    className='mb-3'>
                    <label
                      htmlFor={field.id}
                      className='mb-0 pb-2 form-label'>
                      {field.name}:
                    </label>
                    <input
                      type='text'
                      className={`form-control`}
                      id={field.id}
                      name={field.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[field.name]}
                      placeholder={`Please enter ${field.name}`}
                    />
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Step1;
