import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { SnackbarProvider } from 'notistack';
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
        <Provider store={store}>
     <SnackbarProvider
    maxSnack={3} // Limit to 3 notifications at a time
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
       </Provider>
  </StrictMode>,
)




