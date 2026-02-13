import React from 'react';
import Desktop from './components/os/Desktop';
import { OSProvider } from './context/OSContext';
import './index.css';

function App() {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
}

export default App;
