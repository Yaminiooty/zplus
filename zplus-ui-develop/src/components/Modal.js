import React from 'react';

const Modal = ({ loading, message }) => {
  return (
    <div
      className={`modal ${loading ? 'show' : ''}`}
      tabIndex='-1'
      role='dialog'
      style={{ display: loading ? 'block' : 'none', backgroundColor: '#00000040' }}>
      <div
        className='modal-dialog modal-dialog-centered'
        style={{ width: 'max-content' }}>
        {loading && (
          <div
            className='modal-content align-items-center'
            style={{ border: 'none', borderRadius: '5px' }}>
            <div className='modal-body d-flex align-items-center mx-4 my-2'>
              <div
                className='spinner-border'
                role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
              <span
                className='ms-4'
                style={{ fontSize: '16px' }}>
                {message}...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
