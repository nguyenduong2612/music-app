import React, { Component, lazy } from 'react'
import { StyleSheet, StatusBar } from 'react-native'

import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { setCustomText } from 'react-native-global-props';
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import Home from './src/components/home/Home'
import Playlist from './src/components/playlist/Playlist'

const App = createMaterialTopTabNavigator(
  {
    Home: { screen: Home },
    Playlist: { screen: Playlist }
  },
  {
    initialRouteName: 'Home',
    lazy: true,
    tabBarOptions: {
      style: {
        backgroundColor: '#c6afd1'
      }
    }
  }
)

export default createAppContainer(App)
// export default class App extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       isfontsLoaded: false
//     }
//   }

//   componentDidMount = async() => {
//     await Font.loadAsync({
//       'SanomatSansLight': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansLight.otf'),
//       'SanomatSansRegular': require('./assets/fonts/sanomat-sans-cufonfonts/Sanomat-SansRegular.otf'),
//     })
//     this.setState({ isfontsLoaded: true });
//     setCustomText({ 
//       style: { 
//         fontFamily: 'SanomatSansRegular'
//       }
//     })
//   }

// 	render() {
//     if (this.state.isfontsLoaded) {
//       return (
//         <NavigationContainer>
//           <StatusBar showHideTransition />
//           <Tab.Navigator>
//             <Tab.Screen
//               name="Home"
//               component={Home}
//             />
//             <Tab.Screen
//               name="Playlist"
//               component={Playlist}
//             />
//           </Tab.Navigator>
//         </NavigationContainer>
//       );
//     } else {
//       return <AppLoading />
//     }
//   }
// }