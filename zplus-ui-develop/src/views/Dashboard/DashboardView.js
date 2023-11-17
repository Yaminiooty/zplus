import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { useCallback, useEffect, useState } from 'react';
import bannerImg from '../../assets/images/banner.png';
import { logoMapping } from '../../utils/logoMapping';
import { useDispatch, useSelector } from 'react-redux';
import { deselectTool, deselectToolID, selectTool, selectToolID } from '../../redux/slices/toolsDashboardSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import toolsDashboardThunk from '../../redux/thunks/toolsDashboardThunk';

const DashboardView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedTools = useSelector((state) => state.toolsDashboard.selectedTools);
  const selectedToolsIDs = useSelector((state) => state.toolsDashboard.selectedToolsIDs);
  const isToolsFetching = useSelector((state) => state.toolsDashboard.isToolsFetching);
  const isToolsFetched = useSelector((state) => state.toolsDashboard.isToolsFetched);
  const toolsData = useSelector((state) => state.toolsDashboard.tools);
  const [searchText, setSearchText] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    if (!toolsData) {
      dispatch(toolsDashboardThunk.getTools());
    }
  }, [dispatch, toolsData]);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSelectAllChange = () => {
    if (selectAllChecked) {
      //Deselect all cards
      filteredCards.forEach((card) => {
        dispatch(deselectToolID(card.id));
        dispatch(deselectTool(card.name));
      });
    } else {
      // Select all cards
      filteredCards.forEach((card) => {
        if (card.is_enabled) {
          dispatch(selectToolID(card.id));
          dispatch(selectTool(card.name));
        }
      });
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const handleClearAllClick = () => {
    // Deselect all cards
    filteredCards.forEach((card) => {
      dispatch(deselectToolID(card.id));
      dispatch(deselectTool(card.name));
    });
    setSelectAllChecked(false);
  };

  const handleCardClick = (card) => {
    if (isSelected(card)) {
      dispatch(deselectToolID(card.id));
      dispatch(deselectTool(card.name));
    } else {
      if (card.is_enabled) {
        dispatch(selectToolID(card.id));
        dispatch(selectTool(card.name));
      }
    }
  };

  const isSelected = useCallback(
    (card) => {
      return selectedTools.includes(card.name) && card.is_enabled;
    },
    [selectedTools]
  );

  const handleNextClick = () => {
    if (selectedTools.length === 0) {
      toast.error('Please select tool(s) to proceed.');
    } else {
      dispatch(toolsDashboardThunk.sendSelectedTools({ tool_ids: selectedToolsIDs }));
      navigate(`/configure-tools/${selectedTools[0]}`);
    }
  };

  useEffect(() => {
    if (toolsData) {
      const toolsDataWithLogo = toolsData?.map((tool) => ({ ...tool, logo: logoMapping[tool.name] }));
      const filtered = toolsDataWithLogo.filter(
        (card) => card.is_enabled && card.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCards(filtered);

      // Check if all tools are selected and update selectAllChecked
      const allSelected = filtered.every((card) => isSelected(card));
      setSelectAllChecked(allSelected);
    }
  }, [searchText, selectedTools, toolsData, isToolsFetched, isSelected]);

  return (
    <div className='page-container'>
      <Modal
        loading={isToolsFetching}
        message='Fetching tools data'
      />

      <Header />

      <div className='content'>
        <div className='col-md-12'>
          <img
            src={bannerImg}
            alt=''
            className='img-fluid w-100'
          />
        </div>

        <div className='container-fluid'>
          <div className='card g-2 mt-2'>
            <div className='card-body border-0'>
              <div className='row d-flex align-items-center g-2'>
                <div className='col-md-12 col-sm-12 col-lg-auto'>
                  <h3 className='card-sub-title  text-left'>Quick Search :</h3>
                </div>

                <div className='col-md-6 col-sm-12 col-lg-5'>
                  <div className='form-group has-search'>
                    <span className='fas fa-search form-control-feedback'></span>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Search - Try things like OWASP ZAP to find specific tools for your needs...'
                      id='searchInput'
                      value={searchText}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className='col-md-auto col-sm-12 col-lg-auto'>
                  <div className='form-check float-end'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value=''
                      id='selectAllCheckbox'
                      checked={selectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    <label
                      className='form-check-label'
                      htmlFor='selectAllCheckbox'>
                      Select all
                    </label>

                    <button
                      className='btn'
                      onClick={handleClearAllClick}>
                      <i className='fa-solid fa-xmark'></i> Clear all
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='card g-2 mt-2'>
            <div className='card-body border-0'>
              <div className='row g-2 d-flex align-content-center'>
                <div className='col-md-8 col-sm-12 col-lg-8'>
                  <h3 className='card-title pt-2'>Select the desired tool to process configuration </h3>
                </div>

                <div className='col-md-4 col-sm-12 col-lg-4'>
                  <div className='d-flex justify-content-end'>
                    <button
                      className='btn btn-next w-50'
                      onClick={handleNextClick}>
                      Next <i className='pl-2 fa-solid fa-arrow-right'></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row row-cols-1 row-cols-md-2 g-4 section-margin-bottm mt-1 equal'>
            {filteredCards?.map(
              (card) =>
                card.is_enabled && (
                  <div
                    key={card.id}
                    className='col-lg-4 col-md-6 col-sm-6 col-auto'>
                    <label className='custom-card h-100'>
                      <input
                        className='card__input'
                        type='checkbox'
                        onChange={() => handleCardClick(card)}
                        checked={isSelected(card)}
                      />
                      <div className='card__body'>
                        <div className='card__body-cover'>
                          <div className='d-flex me-5 align-items-center'>
                            <div className='circle'>
                              <img
                                className='img-fluid'
                                src={card.logo}
                                alt=''
                              />
                            </div>
                            <div className='p-2 card-title'>{card.name}</div>
                            <span className='card__body-cover-checkbox'>
                              <i className='card__body-cover-checkbox--svg fa-solid fa-check'></i>
                            </span>
                          </div>
                          <div
                            className='card-content'
                            style={{ textAlign: 'justify' }}>
                            {card.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardView;
