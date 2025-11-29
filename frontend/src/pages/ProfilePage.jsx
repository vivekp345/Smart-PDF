import { useState, useEffect } from 'react';
import { getProfile } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Award, BarChart, LogOut, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#6FFFB0] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-poppins">My Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account and view usage stats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: ID Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1B1F24] rounded-2xl border border-white/5 p-8 relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9C27B0]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              {/* Avatar Placeholder */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9C27B0] to-[#6FFFB0] p-1 shadow-lg shadow-purple-900/40">
                <div className="w-full h-full rounded-full bg-[#1B1F24] flex items-center justify-center">
                   <span className="text-3xl font-bold text-white">
                     {profile?.name?.charAt(0).toUpperCase()}
                   </span>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                <div className="flex items-center gap-2 justify-center sm:justify-start text-gray-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6FFFB0]/10 text-[#6FFFB0] text-xs font-semibold border border-[#6FFFB0]/20">
                  <Award className="w-3 h-3" />
                  {profile?.stats?.plan}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/10 my-8" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account ID</p>
                <p className="text-gray-300 font-mono text-sm truncate">{profile?._id}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Joined On</p>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-[#9C27B0]" />
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="space-y-6">
          
          {/* Stats Card */}
          <div className="bg-[#1B1F24] p-6 rounded-2xl border border-white/5 hover:border-[#6FFFB0]/30 transition-colors">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <BarChart className="w-5 h-5 text-[#6FFFB0]" />
              Usage Statistics
            </h3>
            <div className="text-center py-4">
              <span className="text-5xl font-bold text-white">{profile?.stats?.totalSummaries}</span>
              <p className="text-gray-400 mt-2 text-sm">Total Summaries Generated</p>
            </div>
          </div>

          {/* Logout Button (Redundant but good UX) */}
          <button 
            onClick={logout}
            className="w-full p-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;