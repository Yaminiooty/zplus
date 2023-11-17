const HTMLModal = ({ title, file, setShowModal }) => {
  return (
    <div
      className='modal justify-content-center pt-5 show'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
      style={{ display: 'flex', backgroundColor: '#00000040' }}>
      <div
        className='modal-dialog m-0'
        style={{ maxHeight: '85vh', maxWidth: '60vw' }}>
        <div
          className='modal-content'
          style={{ height: '85vh', width: '60vw', border: 'none', borderRadius: '5px' }}>
          <div className='modal-header'>
            <h5 className='modal-title'>{title}</h5>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={() => setShowModal(false)}></button>
          </div>
          <div className='modal-body p-2'>
            <iframe
              title={title}
              src={`data:text/html;base64,${file.Data}`}
              width='100%'
              height='100%'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLModal;
