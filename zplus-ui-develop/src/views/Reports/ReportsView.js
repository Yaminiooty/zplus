import { Outlet } from 'react-router-dom';
import HeaderWithSidebar from '../../components/HeaderWithSidebar';
import { sidepanelData } from './data';
import { useSelector } from 'react-redux';

const ReportsView = () => {
  const selectedTools = useSelector((state) => state.toolsDashboard.selectedTools);

  const sidepanelFilteredData = sidepanelData.filter((item) => {
    return selectedTools.includes(item.toolName);
  });

  return (
    <>
      <HeaderWithSidebar reports={sidepanelFilteredData} />
      <Outlet />
    </>
  );
};

export default ReportsView;
