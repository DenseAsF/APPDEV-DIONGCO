import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/app/store';
import Nav from './src/navigations';
import { configureGoogleSignIn } from './src/config/googleSignIn';

const App = () => {
  useEffect(() => {
    // Initialize Google Sign-In configuration
    configureGoogleSignIn();
    console.log('[App] Google Sign-In configured');
  }, []);

  return (
    <Provider store={store}>
      <Nav />
    </Provider>
  );
};

export default App;