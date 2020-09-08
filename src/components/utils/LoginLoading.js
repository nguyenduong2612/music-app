import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'

export default class LoginLoading extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={styles.image}
          source={require('../../../assets/kanna_login.png')}
        />
        <Text style={styles.text}>Please login</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={this.props.facebookLogIn}>
          <Text style={styles.loginFbText}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 50
  },
  loginBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 40
  },
  text: {
    fontSize: 28,
    color: '#444',
    fontFamily: 'SanomatSansRegular'
  },
  loginFbText: {
    fontSize: 18,
    fontFamily: 'SanomatSansRegular',
    color: '#fff'
  }
})