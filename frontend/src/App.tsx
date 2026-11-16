import React, { useState, useEffect } from 'react';
import { PageId, BatterRecord, BowlerRecord, FrontendData } from './types';
import staticData from './data/frontend_data.json';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PlayerDetailModal } from './components/common/PlayerDetailModal';
import { OverviewPage } from './pages/OverviewPage';
import { BattingLeaderboardPage } from './pages/BattingLeaderboardPage';
import { BowlingLeaderboardPage } from './pages/BowlingLeaderboardPage';
import { PlayerComparisonPage } from './pages/PlayerComparisonPage';
import { PressureExplorerPage } from './pages/PressureExplorerPage';
import { MethodologyPage } from './pages/MethodologyPage';

export const App: React.FC = () => {
  const data: FrontendData = staticData as unknown as FrontendData;

  // Initialize page from URL hash if present
  const getInitialPage = (): PageId => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validPages: PageId[] = [
      'overview',
      'batting',
      'bowling',
      'comparison',
      'explorer',
      'methodology',
    ];
    if (validPages.includes(hash as PageId)) {
      return hash as PageId;
    }
    // Also check pathname
    const path = window.location.pathname.replace('/', '').toLowerCase();
    if (validPages.includes(path as PageId)) {
      return path as PageId;
    }
    return 'overview';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    player: BatterRecord | BowlerRecord;
    type: 'batter' | 'bowler';
  } | null>(null);

  // Sync hash on navigation
  const handleSelectPage = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  // Listen to hashchange events (for browser forward/back buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectBatterById = (id: number) => {
    const b = data.top10_batters.find((item) => item.player_id === id);
    if (b) {
      setSelectedPlayer({ player: b, type: 'batter' });
    }
  };

  const handleSelectBowlerById = (id: number) => {
    const bw = data.top10_bowlers.find((item) => item.player_id === id);
    if (bw) {
      setSelectedPlayer({ player: bw, type: 'bowler' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onSelectPage={handleSelectPage}
        datasetDate={data.metadata.generated_at}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentPage === 'overview' && (
          <OverviewPage
            data={data}
            onNavigate={handleSelectPage}
            onSelectBatter={handleSelectBatterById}
            onSelectBowler={handleSelectBowlerById}
          />
        )}

        {currentPage === 'batting' && (
          <BattingLeaderboardPage
            data={data}
            onSelectPlayer={(p) => setSelectedPlayer({ player: p, type: 'batter' })}
          />
        )}

        {currentPage === 'bowling' && (
          <BowlingLeaderboardPage
            data={data}
            onSelectPlayer={(p) => setSelectedPlayer({ player: p, type: 'bowler' })}
          />
        )}

        {currentPage === 'comparison' && <PlayerComparisonPage data={data} />}

        {currentPage === 'explorer' && <PressureExplorerPage data={data} />}

        {currentPage === 'methodology' && <MethodologyPage />}
      </main>

      {/* Global Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer.player}
          type={selectedPlayer.type}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
