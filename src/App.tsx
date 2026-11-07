import React, { useState, useEffect } from 'react';
import { Draft, ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { GeneratorView } from './components/GeneratorView';
import { DraftsView } from './components/DraftsView';
import { PlaybookView } from './components/PlaybookView';
import { GuideModal } from './components/GuideModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { fetchDrafts } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Pre-fill inputs when navigating to generator from playbook or sample
  const [generatorPrefill, setGeneratorPrefill] = useState<{
    title: string;
    summary: string;
    url: string;
  }>({
    title: '',
    summary: '',
    url: '',
  });

  // Load drafts on mount
  useEffect(() => {
    async function load() {
      try {
        const loadedDrafts = await fetchDrafts();
        setDrafts(loadedDrafts);
      } catch (err) {
        console.error('Error loading initial drafts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Toast Helper
  const showToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Draft Handlers
  const handleDraftSaved = (newDraft: Draft) => {
    setDrafts((prev) => {
      const exists = prev.some((d) => d.id === newDraft.id);
      if (exists) {
        return prev.map((d) => (d.id === newDraft.id ? newDraft : d));
      }
      return [newDraft, ...prev];
    });
  };

  const handleDraftUpdated = (updatedDraft: Draft) => {
    setDrafts((prev) => prev.map((d) => (d.id === updatedDraft.id ? updatedDraft : d)));
  };

  const handleDraftDeleted = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  // Navigation Helpers
  const handleNewPost = () => {
    setGeneratorPrefill({
      title: '',
      summary: '',
      url: '',
    });
    setActiveTab('create');
  };

  const handleLoadSample = () => {
    setGeneratorPrefill({
      title: 'The Vault Multiplier: 5 Core Revenue Streams for Solo Builders',
      summary: 'A deep dive into how high-performing solo operators leverage automated knowledge vaults, digital assets, and high-margin consulting to scale past $20k/month without burning out.',
      url: 'https://elitehustlevaultcentral.com/blog/vault-multiplier-5-revenue-streams',
    });
    setActiveTab('create');
  };

  const handleSelectDraft = (draft: Draft) => {
    setGeneratorPrefill({
      title: draft.title,
      summary: draft.summary,
      url: draft.url,
    });
    setActiveTab('drafts');
  };

  const handleUseTemplate = (title: string, summary: string) => {
    setGeneratorPrefill({
      title,
      summary,
      url: 'https://elitehustlevaultcentral.com/blog/strategic-blueprint',
    });
    setActiveTab('create');
    showToast('info', 'Template Loaded in Studio', 'Review and generate your social assets.');
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        draftsCount={drafts.length}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area (with safe bottom padding for mobile navigation) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            drafts={drafts}
            setActiveTab={setActiveTab}
            onSelectDraft={handleSelectDraft}
            onNewPost={handleNewPost}
            onLoadSample={handleLoadSample}
            showToast={showToast}
          />
        )}

        {activeTab === 'create' && (
          <GeneratorView
            key={`${generatorPrefill.title}-${generatorPrefill.url}`}
            initialTitle={generatorPrefill.title}
            initialSummary={generatorPrefill.summary}
            initialUrl={generatorPrefill.url}
            onDraftSaved={handleDraftSaved}
            showToast={showToast}
          />
        )}

        {activeTab === 'drafts' && (
          <DraftsView
            drafts={drafts}
            onDraftDeleted={handleDraftDeleted}
            onDraftUpdated={handleDraftUpdated}
            onNewDraftClick={handleNewPost}
            showToast={showToast}
          />
        )}

        {activeTab === 'playbook' && (
          <PlaybookView
            onUseTemplate={handleUseTemplate}
            showToast={showToast}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        draftsCount={drafts.length}
      />

      {/* Technical and Deployment Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
