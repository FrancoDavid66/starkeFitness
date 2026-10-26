import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';

// Tipografías autoalojadas (no dependen de Google Fonts)
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/700-italic.css';
import '@fontsource/barlow-condensed/800-italic.css';
import '@fontsource/barlow-condensed/900-italic.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';

import './index.css';
import App from './App';
import { RouterProvider } from './lib/router';
import { PedidoProvider } from './context/Pedido';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <PedidoProvider>
          <App />
        </PedidoProvider>
      </RouterProvider>
    </MotionConfig>
  </StrictMode>
);
