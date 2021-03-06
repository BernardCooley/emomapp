import React from 'react';
import 'react-native-gesture-handler';
import rootReducer from './Reducers';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { DefaultTheme, Provider as PaperProvider, configureFonts } from 'react-native-paper';
import Main from './components/Main';
import { ApolloProvider } from '@apollo/client';

import ContextWrappers from './contexts/ContextWrappers';

import apolloClient from './apolloSetup';

const App = () => {
  const fontConfig = {
    default: {
      regular: {
        fontFamily: 'Montserrat',
        fontWeight: 'normal'
      }
    },
  };

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#329C97',
      accent: '#f1c40f',
      lightIconsAndText: '#f2f4f3',
      lightgray70Tr: 'rgba(241, 243, 242, 0.7)',
      dark: '#2e2c2f',
      playerDark: '#07102A',
      playerLight: '#595F70',
      midGray: '#5e5e5e',
      lightGray: '#a3a3a3'
    },
    fonts: configureFonts(fontConfig)
  };

  const store = createStore(rootReducer);

  return (
    <ContextWrappers>
      <ApolloProvider client={apolloClient}>
        <PaperProvider theme={theme}>
          <Provider store={store}>
            <Main />
          </Provider>
        </PaperProvider>
      </ApolloProvider>
    </ContextWrappers>
  );
}

export default App;
