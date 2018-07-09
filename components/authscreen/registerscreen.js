import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView} from 'react-native';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
    Provider as PaperProvider,
    TextInput,
    Button,
  } from 'react-native-paper';


  const REGISTER_MUTATION = gql`mutation CreateUserMutation($email: String!, $password: String!) {
    createUser(authProvider: { email: { email: $email, password: $password } }) {
      id
    }
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
      }
    }
  }`;
 
class RegisterScreen extends React.Component {
    state = {
        email: '',
        password: '',
    }
    static navigationOptions = {
    title: 'Register',
    headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }

  render() {
    return (
       <PaperProvider>
        <View style={styles.container}>
        <Mutation mutation={REGISTER_MUTATION}>
        {(CreateUserMutation, {data, loading, error}) => (
           <KeyboardAvoidingView
           behavior="padding"
           contentContainerStyle={{ flex: 1 }}
           style={{ flex: 1 }}
           keyboardVerticalOffset={64}>
          <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps={'handled'}>
            <TextInput
                label="Email"
                value={this.state.email}
                onChangeText={email => this.setState({email: email})}
            />
            <TextInput
              label="Password"
              value={this.state.password}
              onChangeText={password => this.setState({password: password})}
            />
            <Button
              primary
              raised
              disabled={loading}
              onPress={async () => {
                if (this.state.email && this.state.password) {
                    const res = await CreateUserMutation({
                    variables: {
                      email: this.state.email,
                      password: this.state.password,
                    }
                  });
                  this.props.navigation.navigate('Home')
                } else {
                  alert("Please enter email and password");
                }
              }}
            >
            Submit
            </Button>
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


export default RegisterScreen;

