import React from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from 'apollo-boost';
import { createStackNavigator } from 'react-navigation'; 
import HomeScreen from './components/recipescreen/recipesScreen';

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjj6o7ulj7zls010087d0uex2'
});

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <RootStack />
      </ApolloProvider>
    );
  }
}