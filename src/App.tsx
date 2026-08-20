/**
 * SentinelCare - AI-Powered Elderly-Care Monitoring System
 * Futuristic 3D IoT Healthcare Command Center
 */

import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { NotificationCenter } from './components/layout/NotificationCenter';
import { SearchModal } from './components/layout/SearchModal';
import { EmergencyModal } from './components/layout/EmergencyModal';
import { ToastContainer } from './components/layout/ToastContainer';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { MobilityAIPage } from './pages/MobilityAIPage';
import { MedicationPage } from './pages/MedicationPage';
import { AlertsIncidentsPage } from './pages/AlertsIncidentsPage';
import { DevicesSettingsPage } from './pages/DevicesSettingsPage';

const MainLayout: React.FC = () => {
  const { activeTab } = useDashboard();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'monitoring':
        return <LiveMonitoringPage />;
      case 'mobility':
        return <MobilityAIPage />;
      case 'medication':
        return <MedicationPage />;
      case 'alerts':
        return <AlertsIncidentsPage />;
      case 'devices':
        return <DevicesSettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Subtle Cyber Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 w-full min-h-screen overflow-hidden">
        {/* Persistent Collapsible Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Header */}
          <TopHeader onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

          {/* Page Body */}
          <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
            {renderActiveTab()}
          </main>
        </div>
      </div>

      {/* Global Modals & Notifications */}
      <NotificationCenter />
      <SearchModal />
      <EmergencyModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <MainLayout />
    </DashboardProvider>
  );
}
