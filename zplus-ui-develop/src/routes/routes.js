import { createBrowserRouter } from 'react-router-dom';

import SignInView from '../Authentication/SignIn/SignInView';
import ForgotPasswordView from '../Authentication/ForgotPassword/ForgotPasswordView';
import ResetPasswordView from '../Authentication/ResetPassword/ResetPasswordView';
import RegisterView from '../Authentication/Register/RegisterView';
import DashboardView from '../views/Dashboard/DashboardView';
import EmailVerification from '../Authentication/EmailVerification/EmailVerification';
import ConfigureToolsView from '../views/ConfigureTools/ConfigureToolsView';
import NmapForm from '../views/ConfigureTools/ToolForms/Nmap/NmapForm';
import MetasploitForm from '../views/ConfigureTools/ToolForms/Metasploit/MetasploitForm';
import OWASPZapForm from '../views/ConfigureTools/ToolForms/OWASP_ZAP/OWASPZapForm';
import OWASPDependencyCheckForm from '../views/ConfigureTools/ToolForms/OWASP_Dependency_Check/OWASPDependencyCheckForm';
import OpenVASForm from '../views/ConfigureTools/ToolForms/Open_VAS/OpenVASForm';
import SQLMapForm from '../views/ConfigureTools/ToolForms/SQL_Map/SQLMapForm';
import JMeterForm from '../views/ConfigureTools/ToolForms/JMeter/JMeterForm';
import ReviewAndSave from '../views/ReviewAndSave/ReviewAndSave';
import ActionPipeline from '../views/ActionPipeline/ActionPipeline';
import ReportsView from '../views/Reports/ReportsView';
import NetworkDiscovery from '../views/Reports/NetworkDiscovery/NetworkDiscovery';
import VulnerabilityExploitation from '../views/Reports/VulnerabilityExploitation/VulnerabilityExploitation';
import WebApplicationSecurity from '../views/Reports/WebApplicationSecurity/WebApplicationSecurity';
import DependencySecurity from '../views/Reports/DependencySecurity/DependencySecurity';
import SecurityAuditing from '../views/Reports/SecurityAuditing/SecurityAuditing';
import SQLInjection from '../views/Reports/SQLInjection/SQLInjection';
import PerformanceTesting from '../views/Reports/PerformanceTesting/PerformanceTesting';
import ProtectedRoute from './ProtectedRoute';
import UserProfile from '../views/UserProfile/UserProfile';
import ChangePassword from '../views/ChangePassword/ChangePassword';
import ErrorPage from '../components/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignInView />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordView />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordView />,
  },
  {
    path: '/register',
    element: <RegisterView />,
  },
  {
    path: '/email-verification',
    element: <EmailVerification />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user-profile',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/change-password',
    element: (
      <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configure-tools',
    element: (
      <ProtectedRoute>
        <ConfigureToolsView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'Nmap',
        element: <NmapForm />,
      },
      {
        path: 'Metasploit',
        element: <MetasploitForm />,
      },
      {
        path: 'OWASPZAP',
        element: <OWASPZapForm />,
      },
      {
        path: 'OWASPDependencyCheck',
        element: <OWASPDependencyCheckForm />,
      },
      {
        path: 'OpenVAS',
        element: <OpenVASForm />,
      },
      {
        path: 'SQLMap',
        element: <SQLMapForm />,
      },
      {
        path: 'JMeterLoadTesting',
        element: <JMeterForm />,
      },
    ],
  },
  {
    path: '/review-and-save',
    element: (
      <ProtectedRoute>
        <ReviewAndSave />
      </ProtectedRoute>
    ),
  },
  {
    path: '/action-pipeline',
    element: (
      <ProtectedRoute>
        <ActionPipeline />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <ReportsView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'network-discovery',
        element: <NetworkDiscovery />,
      },
      {
        path: 'vulnerability-exploitation',
        element: <VulnerabilityExploitation />,
      },
      {
        path: 'web-application-security',
        element: <WebApplicationSecurity />,
      },
      {
        path: 'dependency-security',
        element: <DependencySecurity />,
      },
      {
        path: 'security-auditing',
        element: <SecurityAuditing />,
      },
      {
        path: 'sql-injection-testing',
        element: <SQLInjection />,
      },
      {
        path: 'performance-testing',
        element: <PerformanceTesting />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
