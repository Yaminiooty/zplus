import BannerImg from '../assets/images/banner.png';

const Banner = () => {
  return (
    <div className='col-md-12'>
      <img
        src={BannerImg}
        alt='Banner'
        className='img-fluid w-100'
      />
    </div>
  );
};

export default Banner;
