import { useEffect, useState } from 'react';
import { Users, Heart, RefreshCw, X, FileText } from 'lucide-react';
import { Profile, Match } from '../types';
import { storage } from '../storage';

export default function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile1, setSelectedProfile1] = useState<string>('');
  const [selectedProfile2, setSelectedProfile2] = useState<string>('');
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);

  const loadProfiles = () => {
    setProfiles(storage.getUnmatchedProfiles());
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleCreateMatch = () => {
    if (!selectedProfile1 || !selectedProfile2) {
      alert('Please select two profiles to match');
      return;
    }

    if (selectedProfile1 === selectedProfile2) {
      alert('Cannot match a profile with itself');
      return;
    }

    const match: Match = {
      id: crypto.randomUUID(),
      profileId1: selectedProfile1,
      profileId2: selectedProfile2,
      createdAt: new Date().toISOString()
    };

    storage.saveMatch(match);
    storage.updateProfile(selectedProfile1, { matched: true });
    storage.updateProfile(selectedProfile2, { matched: true });

    alert('Match created successfully!');
    setSelectedProfile1('');
    setSelectedProfile2('');
    loadProfiles();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            </div>
            <button
              onClick={loadProfiles}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <p className="text-gray-400 mt-2">
            Manually create matches between profiles
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Profiles</p>
            <p className="text-3xl font-bold text-white">{storage.getProfiles().length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Unmatched Profiles</p>
            <p className="text-3xl font-bold text-white">{profiles.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Matches</p>
            <p className="text-3xl font-bold text-white">{storage.getMatches().length}</p>
          </div>
        </div>

        {/* Create Match Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-600" />
            Create New Match
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Profile 1 Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Profile 1
              </label>
              <select
                value={selectedProfile1}
                onChange={(e) => setSelectedProfile1(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
              >
                <option value="">Choose a profile...</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile 2 Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Profile 2
              </label>
              <select
                value={selectedProfile2}
                onChange={(e) => setSelectedProfile2(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
              >
                <option value="">Choose a profile...</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateMatch}
            disabled={!selectedProfile1 || !selectedProfile2}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Create Match
          </button>
        </div>

        {/* Unmatched Profiles Grid */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Unmatched Profiles</h2>

          {profiles.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No unmatched profiles</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-amber-600 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-500"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-1 truncate">
                        {profile.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {profile.bio}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Created: {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingProfile(profile)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 rounded transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Details Modal */}
        {viewingProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Profile Details</h3>
                <button
                  onClick={() => setViewingProfile(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Info */}
                <div className="flex items-start gap-6">
                  <img
                    src={viewingProfile.photoUrl}
                    alt={viewingProfile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-amber-600"
                  />
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">{viewingProfile.name}</h4>
                    <p className="text-gray-300 mb-4">{viewingProfile.bio}</p>
                    <p className="text-gray-500 text-sm">
                      Created: {new Date(viewingProfile.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Questionnaire Answers */}
                {viewingProfile.questionnaire ? (
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Questionnaire Answers
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(viewingProfile.questionnaire.answers).map(([key, value]) => (
                        <div key={key} className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-2 font-medium uppercase">{key}</p>
                          <p className="text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No questionnaire answers available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
