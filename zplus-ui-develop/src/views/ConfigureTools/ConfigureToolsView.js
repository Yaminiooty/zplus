import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import HeaderWithSidebar from '../../components/HeaderWithSidebar';

const ConfigureToolsView = () => {
  const selectedTools = useSelector((state) => state.toolsDashboard.selectedTools);
  const isConfigSaving = useSelector((state) => state.toolsConfig.isConfigSaving);

  return (
    <>
      <Modal
        loading={isConfigSaving}
        message='Saving configuration'
      />
      <HeaderWithSidebar selectedTools={selectedTools} />
      <Outlet />
    </>
  );
};

export default ConfigureToolsView;
