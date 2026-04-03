import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}

export default App;
