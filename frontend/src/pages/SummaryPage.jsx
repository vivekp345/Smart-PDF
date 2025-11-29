import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploader from '../components/FileUploader';
import { Sparkles, Languages, PlayCircle, StopCircle, Clock, AlertCircle } from 'lucide-react'; // Added StopCircle
import { motion } from 'framer-motion';
import { summarizePdf } from '../api/pdfApi';

const SummaryPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  
  // --- NEW: State for Text-to-Speech ---
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speaking if the user leaves the page
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleGenerate = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setSummary(null);
    // Stop any previous speech when generating new summary
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    try {
      const result = await summarizePdf(file, language);
      setSummary(result.summaryText); 
    } catch (err) {
      console.error(err);
      setError("Failed to generate summary. Please try again or check your file.");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Handle Text-to-Speech ---
  const handleSpeak = () => {
    if (!summary) return;

    if (isSpeaking) {
      // If currently speaking, stop it
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Start speaking
      const utterance = new SpeechSynthesisUtterance(summary);
      // Optional: Set language based on selection (e.g., 'hi-IN' for Hindi)
      // utterance.lang = 'en-US'; 
      
      utterance.onend = () => setIsSpeaking(false); // Reset button when done
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9C27B0] to-[#6FFFB0]">{user?.name}</span>
          </h1>
          <p className="text-gray-400 mt-1">Ready to analyze your documents today?</p>
        </div>
      </div>

      {/* 2. Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1B1F24] p-6 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#6FFFB0] rounded-full"></span>
              Upload Document
            </h2>
            <FileUploader onFileSelect={setFile} />
          </div>

          {/* Controls */}
          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1B1F24] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-wrap items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Languages className="w-5 h-5 text-[#6FFFB0]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Output Language</span>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="English" className="bg-[#1B1F24]">English</option>
                    <option value="Hindi" className="bg-[#1B1F24]">Hindi</option>
                    <option value="Telugu" className="bg-[#1B1F24]">Telugu</option>
                    <option value="Spanish" className="bg-[#1B1F24]">Spanish</option>
                    <option value="French" className="bg-[#1B1F24]">French</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] hover:shadow-[0_0_20px_rgba(156,39,176,0.4)] text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Summary
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2"
            >
                <AlertCircle className="w-5 h-5" />
                {error}
            </motion.div>
          )}

          {/* 3. Summary Display */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1B1F24] rounded-2xl border border-[#9C27B0]/30 shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9C27B0]" />
                  AI Summary
                </h3>
                
                {/* --- NEW: Working Listen Button --- */}
                <button 
                  onClick={handleSpeak}
                  className={`text-xs flex items-center gap-1 transition-colors px-3 py-1 rounded-full border ${isSpeaking ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-transparent text-[#6FFFB0] hover:text-white'}`}
                >
                  {isSpeaking ? (
                    <>
                      <StopCircle className="w-4 h-4" /> Stop Reading
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" /> Listen
                    </>
                  )}
                </button>
              </div>
              
              <div className="p-6 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Tips & Recent */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1B1F24] p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-[#6FFFB0]">•</span>
                PDFs under 10MB work best.
              </li>
              <li className="flex gap-2">
                <span className="text-[#6FFFB0]">•</span>
                Scanned documents may be less accurate.
              </li>
              <li className="flex gap-2">
                <span className="text-[#6FFFB0]">•</span>
                Select target language before generating.
              </li>
            </ul>
          </div>

          <div className="bg-[#1B1F24] p-6 rounded-2xl border border-white/5">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Recent
             </h3>
             <p className="text-sm text-gray-500 italic">No history yet.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SummaryPage;