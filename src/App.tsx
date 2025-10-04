import { useState, useEffect } from 'react';
import CreateProfile from './components/CreateProfile';
import Questionnaire from './components/Questionnaire';
import MatchingPage from './components/MatchingPage';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState<'create' | 'questionnaire' | 'matching' | 'admin'>('create');
  const [currentProfileId, setCurrentProfileId] = useState<string>('');

  useEffect(() => {
    // Check if accessing admin panel via secret URL
    const path = window.location.pathname;
    if (path === '/admin-secret-xyz789') {
      setCurrentPage('admin');
    }
  }, []);

  const handleProfileCreated = (profileId: string) => {
    setCurrentProfileId(profileId);
    setCurrentPage('questionnaire');
  };

  const handleQuestionnaireComplete = () => {
    setCurrentPage('matching');
  };

  if (currentPage === 'admin') {
    return <AdminPanel />;
  }

  if (currentPage === 'questionnaire' && currentProfileId) {
    return <Questionnaire profileId={currentProfileId} onComplete={handleQuestionnaireComplete} />;
  }

  if (currentPage === 'matching' && currentProfileId) {
    return <MatchingPage profileId={currentProfileId} />;
  }

  return <CreateProfile onProfileCreated={handleProfileCreated} />;
}

export default App;
