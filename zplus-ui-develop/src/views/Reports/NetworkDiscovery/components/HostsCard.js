const HostsCard = ({ hostsData }) => {
  return (
    <div className='row g-4 mb-4'>
      <div className='col-6 col-lg-4'>
        <div className='app-card app-card-stat shadow-sm h-100'>
          <div className='app-card-body p-3 p-lg-4'>
            <div className='row d-flex align-content-center'>
              <div className='col-auto  d-flex align-items-center'>
                <div className='app-icon-holder'>
                  <i className='fa-solid fa-server'></i>
                </div>
              </div>
              <div className='col-auto'>
                <h4 className='stats-type mb-1'>Total Hosts</h4>
                <div className='stats-figure'>{hostsData?.total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='col-6 col-lg-4'>
        <div className='app-card app-card-stat shadow-sm h-100'>
          <div className='app-card-body p-3 p-lg-4'>
            <div className='row d-flex align-content-center'>
              <div className='col-auto  d-flex align-items-center'>
                <div className='app-icon-holder'>
                  <i className='fa-solid fa-wifi'></i>
                </div>
              </div>
              <div className='col-auto'>
                <h4 className='stats-type mb-1'>Up Hosts</h4>
                <div className='stats-figure'>{hostsData?.up}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='col-6 col-lg-4'>
        <div className='app-card app-card-stat shadow-sm h-100'>
          <div className='app-card-body p-3 p-lg-4'>
            <div className='row d-flex align-content-center'>
              <div className='col-auto  d-flex align-items-center'>
                <div className='app-icon-holder'>
                  <i className='fa-solid fa-laptop-code'></i>
                </div>
              </div>
              <div className='col-auto'>
                <h4 className='stats-type mb-1'>Down Hosts</h4>
                <div className='stats-figure'>{hostsData?.down}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostsCard;
