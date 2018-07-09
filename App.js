import React from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from 'apollo-boost';
import { createStackNavigator } from 'react-navigation'; 
import HomeScreen from './components/recipescreen/recipesScreen';
import DetailsScreen from './components/detailsscreen/detailsScreen';
import CreateRecipeScreen from './components/createrecipescreen/createrecipe';
import RegisterScreen from './components/authscreen/registerscreen';
import LoginScreen from './components/authscreen/loginscreen';
import FavoritesScreen from './components/favoritesscreen/favoritesscreen';

import { AppLoading, Font } from 'expo';
import FontAwesome  
from './node_modules/@expo/vector-icons/fonts/FontAwesome.ttf';
import MaterialIcons  
from './node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf';

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjj6o7ulj7zls010087d0uex2'
});

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
    CreateRecipe: CreateRecipeScreen,
    Favorites: FavoritesScreen,
    Register: RegisterScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Login',
  }
);
console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };
  
  async componentWillMount() {
    try {
      await Font.loadAsync({
        FontAwesome,
        MaterialIcons
      });
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }
    return (
      <ApolloProvider client={client}>
        <RootStack />
       </ApolloProvider>
    );
  }
}