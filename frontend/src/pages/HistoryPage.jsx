import { useState, useEffect } from 'react';
import { fetchHistory, deleteHistoryItem } from '../api/historyApi';
import { Search, Calendar, FileText, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSummary, setSelectedSummary] = useState(null); // For Modal

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent opening modal when clicking delete
    if (window.confirm('Are you sure you want to delete this summary?')) {
      try {
        await deleteHistoryItem(id);
        setHistory(history.filter((item) => item._id !== id));
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  // Filter based on search
  const filteredHistory = history.filter((item) =>
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">History</h1>
          <p className="text-gray-400 mt-1">Manage your past AI summaries.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <input 
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-[#1B1F24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#9C27B0] w-full md:w-64 transition-colors"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#6FFFB0] animate-spin" />
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 bg-[#1B1F24] rounded-2xl border border-white/5">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg text-white font-medium">No summaries found</h3>
              <p className="text-gray-500">Upload a PDF to get started.</p>
            </div>
          ) : (
            /* Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSummary(item)}
                  className="bg-[#1B1F24] p-5 rounded-2xl border border-white/5 hover:border-[#9C27B0]/50 cursor-pointer shadow-lg group transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#9C27B0]/20 transition-colors">
                      <FileText className="w-6 h-6 text-[#9C27B0]" />
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, item._id)}
                      className="text-gray-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-white font-semibold truncate mb-1" title={item.fileName}>
                    {item.fileName}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="text-[#6FFFB0]">{item.language}</span>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-3">
                    {item.summaryText}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal for Full View */}
      <AnimatePresence>
        {selectedSummary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSummary(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1B1F24] w-full max-w-2xl max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSummary.fileName}</h2>
                  <p className="text-sm text-[#6FFFB0] mt-1">AI Generated Summary ({selectedSummary.language})</p>
                </div>
                <button 
                  onClick={() => setSelectedSummary(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                {selectedSummary.summaryText}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;