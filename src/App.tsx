/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { LiveInterviewView } from './views/LiveInterviewView';
import { CoachView } from './views/CoachView';
import { NlpHubView } from './views/NlpHubView';
import { DailyQuestionsView } from './views/DailyQuestionsView';
import { MockTracksView } from './views/MockTracksView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';
import { RemindersView } from './views/RemindersView';
import { EvaluationReportModal } from './views/EvaluationReportModal';
import { IncomingCallModal } from './components/IncomingCallModal';

function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { activeView, selectedReportForModal, setSelectedReportForModal } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'live-interview':
        return <LiveInterviewView />;
      case 'reminders':
        return <RemindersView />;
      case 'coach':
        return <CoachView />;
      case 'nlp-hub':
        return <NlpHubView />;
      case 'daily':
        return <DailyQuestionsView />;
      case 'mock-tracks':
        return <MockTracksView />;
      case 'progress':
        return <ProgressView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-68">
        <Header onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Simulated Recruiter Phone Call Overlay */}
      <IncomingCallModal />

      {/* Evaluation Report Modal */}
      {selectedReportForModal && (
        <EvaluationReportModal
          report={selectedReportForModal}
          onClose={() => setSelectedReportForModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
