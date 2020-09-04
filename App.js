import React, { Component, lazy } from 'react'
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
    isfontsLoaded: false
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
          lazy={true}
        >
          <Tab.Screen 
            name="Home" 
            component={Home}
          />
          <Tab.Screen 
            name="Playlist" 
            component={Playlist} 
          />
        </Tab.Navigator>
      </NavigationContainer>
      
    )
  }
}