import React from 'react';
import { Game } from './components/Game';

const App: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
      <Game />
    </div>
  );
};

export default App;