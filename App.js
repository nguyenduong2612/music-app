import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import Home from './src/components/home/Home'
import Playlist from './src/components/playlist/Playlist'

const Tab = createMaterialTopTabNavigator()
export default class App extends React.Component {
  state = {
    isfontsLoaded: false,
    currentIndex: 0,
    playbackInstance: null,
    songs: []
  }
  
  componentDidMount = async() => {
    await Font.loadAsync({
			'SanomatSansLight': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansLight.otf'),
      'SanomatSansRegular': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansRegular.otf'),
      'SanomatSansBold': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansBold.otf'),
    })
    this.setState({ isfontsLoaded: true });
  }

  render() {
    if (!this.state.isfontsLoaded) {
      return <AppLoading />
    }
    return (
      <NavigationContainer>
        <StatusBar backgroundColor='#fff' barStyle='dark-content' />
        <Tab.Navigator
          tabBarOptions={{
            labelStyle: {
              fontFamily: 'SanomatSansRegular',
            }
          }}
        >
          <Tab.Screen 
            name="Home" 
            children={()=><Home
              currentIndex={this.state.currentIndex}
              songs={this.state.songs}
              playbackInstance={this.state.playbackInstance}
              updateCurrentIndex={(currentIndex) => this.setState({currentIndex})}
              updateSongs={(songs) => this.setState({songs})} 
              updatePlaybackInstance={(playbackInstance) => this.setState({playbackInstance})} />}
          />
          <Tab.Screen 
            name="Playlist" 
            children={()=><Playlist
              currentIndex={this.state.currentIndex}
              songs={this.state.songs}
              playbackInstance={this.state.playbackInstance}
              updateCurrentIndex={(currentIndex) => this.setState({currentIndex})}
              updateSongs={(songs) => this.setState({songs})}
              updatePlaybackInstance={(playbackInstance) => this.setState({playbackInstance})} />}
          />
        </Tab.Navigator>
      </NavigationContainer>
      
    )
  }
}