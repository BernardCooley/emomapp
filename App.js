import 'react-native-gesture-handler';
import rootReducer from './Reducers';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import { DefaultTheme, Provider as PaperProvider, configureFonts } from 'react-native-paper';
import Main from './components/Main';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

const appolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const ALL_TRACKS = gql`
    {
        tracks {
            id
            title
            artistId
            description
            duration
        }
    }
`;

const App = () => {
  const { loading, error, data } = useQuery(ALL_TRACKS);

  console.log(data);
  console.log(error);


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
    <ApolloProvider client={appolloClient}>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <Main />
        </Provider>
      </PaperProvider>
    </ApolloProvider>
  );
}

export default App;
