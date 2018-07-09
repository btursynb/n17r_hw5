import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Constants } from 'expo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import RecipesList from './recipesList';
import {
  Provider as PaperProvider,
  Button,
  FAB
} from 'react-native-paper';
const GET_ALL_RECIPES = gql`
{
  allRecipies {
    id
    title
    description
    image
  }
}
`;
class RecipesScreen extends React.Component {
  static navigationOptions = {
    title: 'Recipes List',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
  render() {
    const userID = this.props.navigation.getParam('userID');
    return (
       <PaperProvider>
        <View style={styles.container}>
          <RecipesList navigation={this.props.navigation} query={GET_ALL_RECIPES}/>
          <Button  onPress={()=>this.props.navigation.navigate("Favorites", {userID: userID})} style={styles.btnFav}>Go to favorites</Button>
          <FAB
              medium
              icon="add"
              style={styles.fabstyle}
              onPress={()=>this.props.navigation.navigate("CreateRecipe", {query: GET_ALL_RECIPES})}
            />
        </View>
        </PaperProvider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    alignItems: 'stretch',
//  marginTop: Constants.statusBarHeight
  },
  fabstyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  btnFav: {
    
  },
});


export default RecipesScreen;

