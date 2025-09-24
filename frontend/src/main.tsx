import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ConsentProvider } from './context/ConsentContext'
import { I18nProvider } from './lib/i18n'
import './registerServiceWorker'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider>
      <ConsentProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConsentProvider>
    </I18nProvider>
  </React.StrictMode>
)
