import React from 'react';
import { Provider } from 'react-redux';
import store from './src/app/store';
import Nav from './src/navigations';

const App = () => {
  return (
    <Provider store={store}>
      <Nav />
    </Provider>
  );
};

export default App;