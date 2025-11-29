import { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    setFile(selectedFile);
    onFileSelect(selectedFile); // Send to parent
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`relative group cursor-pointer w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6
              ${dragActive 
                ? 'border-[#6FFFB0] bg-[#6FFFB0]/5' 
                : 'border-white/20 bg-white/5 hover:border-[#9C27B0]/50 hover:bg-white/10'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleChange}
            />
            
            <div className="p-4 rounded-full bg-[#1B1F24] shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-[#6FFFB0]' : 'text-[#9C27B0]'}`} />
            </div>
            <p className="text-lg font-medium text-white mb-1">
              Click to upload or drag & drop
            </p>
            <p className="text-sm text-gray-400">PDF files only (Max 10MB)</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-32 rounded-2xl bg-[#9C27B0]/10 border border-[#9C27B0]/30 flex items-center justify-between p-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-4 z-10">
              <div className="p-3 bg-[#9C27B0]/20 rounded-xl">
                <FileText className="w-8 h-8 text-[#9C27B0]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            <button
              onClick={removeFile}
              className="p-2 hover:bg-red-500/20 rounded-full transition-colors z-10 group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
            </button>
            
            {/* Background Glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#9C27B0]/20 blur-3xl rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;