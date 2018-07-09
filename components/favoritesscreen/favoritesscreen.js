import React from 'react';
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity, Dimensions, Image, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import {
  Provider as PaperProvider,
  Button,
  FAB
} from 'react-native-paper';

const GET_USER_FAVORITES = gql`query getUserFavorites($userID: String!) {
    allFavorites(filter: {
        userID: $userID
    }){
        id
        recipyID
    }
}`;
const GET_ONE_RECIPY = gql`query getRecipy($id: ID = "cjj6p833cw0b40183x2jkbeh3") {
    Recipy(id: $id){
        id
        title
        description
        instructions
        ingredients
        image
    }
}`;

class FavoritesScreen extends React.Component {
  static navigationOptions = {
    title: 'Favorites',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
  data = null;
  renderRecipe = ({item: recipe}) => {
    const userID = this.props.navigation.getParam('userID');
    return (
      <View style={styles.listItem}>
         <TouchableOpacity
            key={recipe.id}
            style={styles.recipyItem}
             onPress={() => this.props.navigation.navigate('Details', { recipeID: recipe.id, userID: userID })}
          >
          <Image
            style={styles.recipePicSmall}
            source={{
              uri: recipe.image,
            }}/>
            <View style={styles.recipyText}>
              <Text style={styles.title}>
                {recipe.title}
              </Text>
              <Text>
                {recipe.description}
              </Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  }
  getOneRecipe = (id) => {
    <Query query={GET_ONE_RECIPY} variables={{id}}>
    {({loading, data, error}) => {
       return (data ? data.Recipy : null );
    }}
    </Query>
  }
  getAllFavorites = (userID) => {
     <Query query={GET_USER_FAVORITES} variables={{userID}}>
    {({loading, data, error}) => {
       return (data ? data.allFavorites : null );
    }}
    </Query>
  }
  render() {
    const userID = this.props.navigation.getParam('userID'); //"cjjcwzst6g6ge0132x3vpcwi8";
    const allFavorites = this.getAllFavorites(userID);
    const listData = allFavorites.map(favoriteRecipe => {
        const fid = favoriteRecipe.recipyID;
        return this.getOneRecipe(fid);
    })

    return (
       <PaperProvider>
        <View style={styles.container}>
        {
            listData ? 
            <FlatList
            keyExtractor={item => item.id}
            style={styles.list}
            data={listData}
            renderItem={this.renderRecipe}
            />
            :
            <ActivityIndicator />
        }
            
        </View>
        </PaperProvider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  list: {},
});


export default FavoritesScreen;
