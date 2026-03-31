import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../features/slice/analysisSlice';


const ModeSelector = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.analysis.mode);

  const modes = [
    { id: 'quick', label: 'Quick' },
    { id: 'interactive', label: 'Interactive' },
    { id: 'bulk', label: 'Bulk (Multi-Patent)' }
  ];

  return (
    <div className="flex justify-center mb-10">
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex space-x-1">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => dispatch(setMode(m.id))}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m.id
                ? 'bg-[#ff6b00] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;