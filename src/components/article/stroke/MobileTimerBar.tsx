import React from 'react';

interface MobileTimerBarProps {
  elapsedSeconds: number;
  arrivalTime: string;
  isRunning: boolean;
}

export const MobileTimerBar: React.FC<MobileTimerBarProps> = ({
  elapsedSeconds,
  arrivalTime,
  isRunning
}) => {
  const elapsedMinutes = elapsedSeconds / 60;
  const minutes = Math.floor(elapsedMinutes);
  const seconds = elapsedSeconds % 60;

  const getBackgroundColor = () => {
    if (!isRunning) return 'bg-blue-600';
    if (elapsedMinutes < 25) return 'bg-green-500';
    if (elapsedMinutes < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`${getBackgroundColor()} px-4 py-2 flex items-center justify-between text-white shadow-inner transition-colors duration-500`}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">timer</span>
        <span className="text-xs font-semibold uppercase tracking-wider">
          {arrivalTime ? `Arrival Time: ${arrivalTime}` : 'Ready to Start'}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black tabular-nums">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold">MIN ELAPSED</span>
      </div>
    </div>
  );
};
