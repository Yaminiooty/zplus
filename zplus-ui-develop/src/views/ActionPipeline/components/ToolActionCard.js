import { PIPELINE_STATUS } from '../../../utils/constants';

const ToolActionCard = ({ data }) => {
  const getStatusClassName = (status) => {
    switch (status) {
      case PIPELINE_STATUS.COMPLETED:
        return 'bg-success';
      case PIPELINE_STATUS.FAILED:
        return 'bg-danger';
      case PIPELINE_STATUS.IN_PROGRESS:
        return 'bg-info';
      case PIPELINE_STATUS.PENDING:
        return 'bg-warning';
      default:
        return '';
    }
  };

  return (
    <>
      {data?.map((item) => (
        <div
          key={item.tool_name}
          className='col-12 col-lg-4 col-md-6'>
          <div className='app-card app-card-basic d-flex flex-column align-items-start shadow-sm'>
            <div className='app-card-header p-3 border-bottom-0'>
              <div className='row align-items-center gx-3'>
                <div className='col-auto'>
                  <div className='app-icon-holder'>
                    <img
                      src={item.tool_image}
                      alt='nmap'
                      className='img-fluid'
                      width='60%'
                    />
                  </div>
                </div>
                <div className='col-auto'>
                  <h4 className='app-card-title'>{item.tool_name}</h4>
                </div>
              </div>
            </div>
            <div className='app-card-body px-4 pb-3'>
              <div className='intro'>{item.tool_intro}</div>
              <div className='row pt-3 d-flex align-content-around'>
                <div className='col-12'>
                  <span>
                    <strong>Status :</strong>
                  </span>
                  <span className={`badge ${getStatusClassName(item.status)} ms-2`}>{item.status}</span>
                </div>
                <div className='col-12 pt-2'>
                  <span>
                    <strong>Last Run :</strong>
                  </span>
                  {item.status_update_time_stamp && (
                    <span className='ms-2'>{new Date(item.status_update_time_stamp).toISOString().split('T')[0]}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ToolActionCard;
