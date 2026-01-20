import React from 'react';

/**
 * HelpModal - Displays game instructions in Windows 95 Retro style
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close handler
 * @param {object} gameConfig - Current game configuration with helpText
 */
const HelpModal = ({ isOpen, onClose, gameConfig }) => {
  if (!isOpen || !gameConfig?.helpText) return null;

  const { title, objective, controls, tips } = gameConfig.helpText;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Main Window - Win95 Style */}
      <div 
        className="bg-[#c0c0c0] dark:bg-[#2d2d2d] w-full max-w-md mx-4 
                   border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]
                   dark:border-t-[#555] dark:border-l-[#555] dark:border-b-black dark:border-r-black
                   shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar - Navy Blue Win95 Style */}
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 flex justify-between items-center">
          <span className="text-white font-bold font-mono text-sm tracking-wide flex items-center gap-2">
            {title.toUpperCase()}.HLP
          </span>
          <button 
            onClick={onClose}
            className="w-5 h-5 bg-[#c0c0c0] border border-t-white border-l-white border-b-[#808080] border-r-[#808080]
                       active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white
                       flex items-center justify-center font-bold text-xs hover:bg-[#d0d0d0] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Area - Sunken Effect */}
        <div className="p-2">
          <div className="bg-white dark:bg-[#1a1a1a] p-4 
                          border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white
                          dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555]">
            
            {/* Objective Section */}
            <div className="mb-4">
              <span className="font-mono font-bold text-green-600 dark:text-green-400">OBJECTIVE: </span>
              <span className="font-mono text-gray-800 dark:text-gray-200">{objective}</span>
            </div>

            {/* Controls Section */}
            <div className="mb-4">
              <div className="font-mono font-bold text-purple-600 dark:text-purple-400 mb-2">CONTROLS:</div>
              <ul className="font-mono text-gray-800 dark:text-gray-200 text-sm space-y-1 ml-4">
                {controls.map((ctrl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-600 dark:text-cyan-400">-</span>
                    <span>{ctrl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips Section */}
            {tips && (
              <div className="bg-[#ffffcc] dark:bg-yellow-900/40 p-3 
                              border border-[#808080] dark:border-yellow-700
                              font-mono text-sm text-gray-800 dark:text-yellow-200">
                <span className="font-bold">TIP:</span> {tips}
              </div>
            )}
          </div>
        </div>

        {/* Button Area */}
        <div className="p-2 pt-0 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-1 bg-[#c0c0c0] dark:bg-[#404040] font-mono font-bold text-sm
                       border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]
                       dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-black dark:border-r-black
                       active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white
                       active:translate-y-0.5 transition-all
                       hover:bg-[#d0d0d0] dark:hover:bg-[#505050]
                       focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
