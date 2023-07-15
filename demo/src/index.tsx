import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from 'react-modal-navigator';
import { StrictMode } from 'react';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ModalProvider pages={{}}>
      <App />
    </ModalProvider>
  </StrictMode>
);
