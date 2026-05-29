import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/app/store';
import Nav from './src/navigations';
import { configureGoogleSignIn } from './src/config/googleSignIn';
import { NotificationProvider } from './src/context/NotificationContext';

const App = () => {
  useEffect(() => {
    configureGoogleSignIn();
    console.log('[App] Google Sign-In configured');
  }, []);

  return (
    <Provider store={store}>
      <NotificationProvider>
        <Nav />
      </NotificationProvider>
    </Provider>
  );
};

export default App;