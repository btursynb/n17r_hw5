import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, Image, KeyboardAvoidingView} from 'react-native';
import { Constants, ImagePicker } from 'expo';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
    Provider as PaperProvider,
    TextInput,
    Button,
    Caption
  } from 'react-native-paper';
const FILE_UPLOAD_URL = "https://api.graph.cool/file/v1/cjj6o7ulj7zls010087d0uex2";
const CREATE_RECIPY = gql`mutation CreateRecipe($description: String!, $ingredients: [String!]!, $instructions: [String!]!, $title: String!, $image: String!) {
    createRecipy(
      description: $description
      ingredients: $ingredients
      instructions: $instructions
      title: $title
      image: $image
    ) {
      id
    }
  }`;

class CreateRecipeScreen extends React.Component {
    state = {
        title: '',
        description: '',
        ingredients: [],
        instructions: [],
        ingredientToAdd: "",
        instructionToAdd: "",
        imageURI: "",
    }
    static navigationOptions = {
    title: 'Create Recipe',
    headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
  }
  addIngredient = () => {
      const currentIngredients = [...this.state.ingredients, this.state.ingredientToAdd]
      this.setState({ingredients: currentIngredients, ingredientToAdd: ''});
  }
  addInstruction = () => {
    const currentInstructions = [...this.state.instructions, this.state.instructionToAdd]
    this.setState({instructions: currentInstructions, instructionToAdd: ''});
}
loadImage = async () => {
  //await PermissionRequest.askAsync(Permissions.CAMERA_ROLL);
  const picture = await ImagePicker.launchImageLibraryAsync();
  if (!picture.cancelled) {
    this.setState(prevState => ({ imageURI: picture.uri }));
  }
}
uploadImage = async () => {
  if (!this.state.imageURI) {
    return null;
  }
  let formData = new FormData();
  formData.append('data', {uri: this.state.imageURI, name: 'image3.jpg', type: 'multipart/form-data'});
  try {
    const result = await fetch(FILE_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });
    const json = await result.json();
    return json.url;

  } catch (err) {
    console.log('err', err);
    return null;
  }
}
  render() {
    return (
       <PaperProvider>
        <View style={styles.container}>
        <Mutation mutation={CREATE_RECIPY}>
        {(CreateRecipe, {data, loading, error}) => (
           <KeyboardAvoidingView
           behavior="padding"
           contentContainerStyle={{ flex: 1 }}
           style={{ flex: 1 }}
           keyboardVerticalOffset={64}>
          <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps={'handled'}>
            {!!data && <Text>{data.id}</Text>}
            {!!this.state.imageURI && (
              <View style={styles.imagePicker}>
              <Image
                style={styles.recipePic}
                source={{
                  uri: this.state.imageURI,
              }}/>
              <Button primary onPress={this.loadImage}>Change picture</Button>
              </View>
              )
            }
            {!this.state.imageURI && (<Button primary onPress={this.loadImage}>Choose picture</Button>)}
            
            <TextInput
                label="Title"
                value={this.state.title}
                onChangeText={title => this.setState({title: title})}
            />
            <TextInput
              label="Description"
              value={this.state.description}
              onChangeText={description => this.setState({description: description})}
            />
            {this.state.ingredients.length > 0 && (<Caption>Ingredients</Caption>)}
            
            {this.state.ingredients.map((ingredient, idx )=> {return (<Text key={"ingr" + idx}>{ingredient}</Text>)})}
            <TextInput
              label="Add Ingredient"
              value={this.state.ingredientToAdd}
              onChangeText={ingredientToAdd => this.setState({ingredientToAdd: ingredientToAdd})}
            />
            <Button raised onPress={this.addIngredient}> Add ingredient </Button>
            {this.instruction > 0 &&(<Caption>Instructions</Caption>)}
            {this.state.instructions.map((instruction, idx) => {return (<Text key={"instr" + idx}>{instruction}</Text>)})}
            <TextInput
              label="Add Instruction"
              value={this.state.instructionToAdd}
              onChangeText={instructionToAdd => this.setState({instructionToAdd: instructionToAdd})}
            />
            <Button raised onPress={this.addInstruction}> Add instruction </Button>
            <Button
              primary
              raised
              disabled={loading}
              onPress={async () => {
                const imageGraphQLURL = await this.uploadImage();
                if (imageGraphQLURL) {
                  CreateRecipe({
                    variables: {
                      description: this.state.description,
                      ingredients: this.state.ingredients,
                      instructions: this.state.instructions,
                      image: imageGraphQLURL,
                      title: this.state.title
                    }
                  });
                  //const query = this.props.navigation.getParam('query');
                  //query.props.refetch();
                  // console.log(query);
                  
                  //console.log('works')
                  this.props.navigation.navigate('Home')
                } else {
                  alert("Please attach image to the recipe");
                }
              }}
            >Submit</Button>
          </ScrollView>
          </KeyboardAvoidingView>
        )}
        </Mutation>
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
  ingredients: {
    marginLeft: 10,
  },
  recipePic: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },
  imagePicker: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
  }
});


export default CreateRecipeScreen;

