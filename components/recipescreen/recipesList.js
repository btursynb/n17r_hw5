import { ActivityIndicator, FlatList, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import {
  Provider as PaperProvider,
  Paragraph, 
  Title,
  Caption,
  Button
} from 'react-native-paper';
import { createStackNavigator } from 'react-navigation'; 



class RecipesList extends React.Component {
  
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

  render() {
    return (
      <PaperProvider>
      <Query query={this.props.query}>
        {({loading, data, refetch}) => (
          loading
            ? <ActivityIndicator />
            : (
              <React.Fragment>
                <FlatList
                  keyExtractor={item => item.id}
                  style={styles.list}
                  data={data ? data.allRecipies : []}
                  refreshing={data.networkStatus === 4}
                  onRefresh={() => refetch()}
                  renderItem={this.renderRecipe}
                />
              </React.Fragment>
            ) 
        )}
        
      </Query>
      </PaperProvider>
    );
  }
}

const styles = {
  title: {
    fontSize: 24,
  },
  description: {

  },
  listItem: {
    paddingTop: 10,
    height: Dimensions.get('window').height / 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
  list: {
    marginLeft: 10,
  },
  recipePicSmall: {
    width: 50,
    height: 50,
  },
  recipyItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  recipyText: {
    paddingLeft: 10,
  },
}
export default RecipesList;
