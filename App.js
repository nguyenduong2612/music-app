import React, { Component } from 'react'
import { StatusBar, Alert, YellowBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import * as Facebook from 'expo-facebook'
import { FACEBOOK_APP_ID } from '@env'

import Home from './src/components/home/Home'
import Playlist from './src/components/playlist/Playlist'
import Profile from './src/components/profile/Profile'
import LoginLoading from './src/components/utils/LoginLoading'
import database from './src/config/firebaseConfig'

const Tab = createMaterialTopTabNavigator()
export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isfontsLoaded: false,
      isLoggedIn: false,
      userData: null,
      currentIndex: 0,
      playbackInstance: null,
      songs: []
    }
    YellowBox.ignoreWarnings(['Setting a timer']);
  }

  facebookLogIn = async() => {
    try {
      await Facebook.initializeAsync(FACEBOOK_APP_ID);
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
         .then(response => response.json())
         .then(async(data) => { 
          let userRef = await database.collection('user_id').doc(data.id).get()
          if (!userRef.exists) {
            await database.collection('user_id').doc(data.id).set({
              loggedIn: true,
              currentIndex: 0,
              songs: []
            })
          } else {
            await database.collection('user_id').doc(data.id).update({
              loggedIn: true
            })
          }
          this.setState({ 
            userData: data,
            isLoggedIn: true
          })
          this.getData()
        })
        .catch(e => console.log(e))
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      Alert.alert(`Facebook Login Error: ${message}`);
    }
  }

  facebookLogout = async() => {
    await database.collection('user_id').doc(this.state.userData.id).update({
      loggedIn: false
    })
    this.setState({ 
      userData: null,
      isLoggedIn: false
    })

    let { playbackInstance } = this.state

    if (!playbackInstance) return
    await playbackInstance.pauseAsync()
    this.setState({ playbackInstance })
  }

  getData = async() => {
    let userRef = await database.collection('user_id').doc(this.state.userData.id).get()

    this.setState({
      currentIndex: userRef.data().currentIndex,
      songs: userRef.data().songs
    })
  }
  
  componentDidMount = async() => {
    await Font.loadAsync({
			'SanomatSansLight': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansLight.otf'),
      'SanomatSansRegular': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansRegular.otf'),
      'SanomatSansBold': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansBold.otf'),
    })
    this.setState({ isfontsLoaded: true });
    this.facebookLogIn()
  }

  updateCurrentIndex = async(currentIndex) => {
    this.setState({currentIndex})
    database.collection('user_id').doc(this.state.userData.id).update({
      currentIndex: currentIndex
    })
  }

  updateSongs = async(songs) => {
    this.setState({songs})
    database.collection('user_id').doc(this.state.userData.id).update({
      songs: songs
    })
  }

  render() {
    if (!this.state.isfontsLoaded) {
      return <AppLoading />
    } 
    if (this.state.isLoggedIn) {
      return (
        <NavigationContainer>
          <StatusBar backgroundColor='#fff' barStyle='dark-content' />
          <Tab.Navigator
            initialRouteName='Home'
            tabBarOptions={{
              labelStyle: {
                fontFamily: 'SanomatSansRegular',
              }
            }}
          >
            <Tab.Screen 
              name="Profile"
              children={() => (
                <Profile 
                  avatar={this.state.userData.picture.data.url}
                  userName={this.state.userData.name}
                  onLogout={this.facebookLogout} 
                />)
              }
            />
            <Tab.Screen 
              name="Home" 
              children={() => (
                <Home
                  currentIndex={this.state.currentIndex}
                  songs={this.state.songs}
                  playlist={this.state.playlist}
                  playbackInstance={this.state.playbackInstance}
                  updateCurrentIndex={this.updateCurrentIndex}
                  updateSongs={this.updateSongs} 
                  updatePlaybackInstance={(playbackInstance) => this.setState({playbackInstance})} 
                />)
              }
            />
            <Tab.Screen 
              name="Playlist" 
              children={() => (
                <Playlist
                  currentIndex={this.state.currentIndex}
                  songs={this.state.songs}
                  playbackInstance={this.state.playbackInstance}
                  updateCurrentIndex={this.updateCurrentIndex}
                  updateSongs={this.updateSongs}
                  updatePlaybackInstance={(playbackInstance) => this.setState({playbackInstance})} 
                />)
              }
            />
          </Tab.Navigator>
        </NavigationContainer>
      )
    } else {
      return <LoginLoading facebookLogIn={this.facebookLogIn} />
    }
  }
}