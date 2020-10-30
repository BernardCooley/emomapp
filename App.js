import 'react-native-gesture-handler';
import React from 'react';
import rootReducer from './Reducers';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Main from './components/Main';

const App = () => {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#329C97',
      accent: '#f1c40f',
    },
  };

  const store = createStore(rootReducer);

  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <Main/>
      </Provider>
    </PaperProvider>
  );
}

export default App;
