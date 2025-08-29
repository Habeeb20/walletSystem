import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { SnackbarProvider } from 'notistack';
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { PersistGate } from 'redux-persist/lib/integration/react.js';
import {persistor} from "./redux/store/index.js"

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <Provider store={store}>
        <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => console.log('Persisted state after rehydration:', store.getState())}
      >
     <SnackbarProvider
    maxSnack={3} 
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    classes={{
      variantSuccess: 'bg-green-500 text-white',
      variantError: 'bg-red-500 text-white',
      variantWarning: 'bg-yellow-500 text-white',
      variantInfo: 'bg-blue-500 text-white',
    }}
  >

				
					<App />
			  <Toaster richColors position="top-right" />
	  </SnackbarProvider>
    </PersistGate>
       </Provider>
  </StrictMode>,
)




