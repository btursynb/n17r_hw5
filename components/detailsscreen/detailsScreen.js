import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Share, Image, Dimensions } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
    Provider as PaperProvider,
    Paragraph, 
    Title,
    Caption,
    Button,
    Card,
    CardActions,
    CardContent,
    CardCover,
  } from 'react-native-paper';

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

  const CHECK_FAVORITE = gql`query getFavorite($userID: String!, $recipyID: String!) {
    allFavorites(filter: {
      AND: [{
        userID: $userID
      }, {
        recipyID: $recipyID
      }]
    }){
        id
    }
}`;

const ADD_FAVORITE = gql`mutation CreateFavorite($userID: String!, $recipyID: String!) {
  createFavorite(
      userID: $userID
      recipyID: $recipyID
    ) {
      id
    }
  }`;   

class DetailsScreen extends React.Component {
  state = {
      visible: false,
      isFavorite: false,
    }
  data = null;
    
  static navigationOptions = {
    title: 'Details',
    headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
  };
  // should check if receipt already in favorites
  // dunno why doesn't work
  componentDidMount = () => {
    const userID = this.props.navigation.getParam('userID');
    const recipyID = this.props.navigation.getParam('recipeID');
    <Query query={GET_ONE_RECIPY} variables={{userID: userID, recipyID: recipyID}}>
      {({loading, data, error}) => {
       if (data) {
         this.setState(prevState => ({isFavorite: true}));
        }
      }}
    </Query>
  };

  handleShare = () => {
    const recipe = this.data.Recipy;
    if (!!recipe) {
      Share.share({
        message: recipe.title + ": " + recipe.description,
        title: recipe.title,
      }, {
        dialogTitle: 'Share with friends',
      })
    }  
  }

  renderDetails = (id) => {
    return(
      <View>
        <Query query={GET_ONE_RECIPY} variables={{id}}>
            {({loading, data, error}) => {
            this.data = data;
            return (loading
                ? <ActivityIndicator />
                : (
                <React.Fragment>
                  <Card>
                  <CardContent>
                    <Title>{data.Recipy.title}</Title>
                    <Paragraph>{data.Recipy.description}</Paragraph>
                    <View>
                        <Caption> Ingredients:</Caption>
                        {data.Recipy.ingredients.map((ingredient, index )=> {return (<Text key={'ing' + data.Recipy.id + index} style={styles.ingredients}>>{ingredient}</Text>)})}
                    </View>
                    <View>
                        <Caption> Instructions:</Caption>
                        {data.Recipy.instructions.map((instruction, index) => {return (<Text key={'ins' + data.Recipy.id + index} > >{instruction}</Text>)})}
                    </View>
                  </CardContent>
                  <CardCover source={{ uri: data.Recipy.image }} />
                  <CardActions style={styles.cardAction}>
                    <Button primary onPress={this.handleShare}> Share </Button>
                    {!this.state.isFavorite && <Mutation mutation={ADD_FAVORITE}>
                    {(CreateFavorite, {data, loading, error}) => (
                          
                        <Button
                          onPress={async () => {
                            const userID = this.props.navigation.getParam('userID');
                            const recipyID = this.props.navigation.getParam('recipeID');
                            console.log('uid', userID, 'rid', recipyID)
                            if (userID && recipyID) {
                                const res = await CreateFavorite({
                                variables: {
                                  userID: userID,
                                  recipyID: recipyID,
                                }
                              });
                              this.setState(prevState => ({isFavorite: true}));
                              console.log('added to fav', res)
                            } else {
                              alert("Something wrong, please try again");
                            }
                          }}
                        >
                        Add to favorites
                        </Button>
                    )}
                    </Mutation>}
                    {this.state.isFavorite && <Button>Added to favorites</Button>}
                </CardActions>
                </Card>
                </React.Fragment>
                ));
            }}
        </Query>
        
        </View>
    );        
  }

  render() {
    return (
       <PaperProvider>
        <View style={styles.container}>
            {this.renderDetails(this.props.navigation.getParam('recipeID'))}
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
    marginLeft: 10,
    //marginTop: Constants.statusBarHeight
  },
  ingredientsContainer: {

  },
  recipePic: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },
  ingredients: {
    marginLeft: 10,
  },
  cardAction: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

export default DetailsScreen;

