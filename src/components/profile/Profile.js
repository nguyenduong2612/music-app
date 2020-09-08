import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class Profile extends Component {
  handleLogout = () => {
    this.props.onLogout()
  }

  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={{ width: 150, height: 150, borderRadius: 75 }}
          source={{ uri: this.props.avatar }}/>
        <Text style={styles.userName}>{this.props.userName}</Text>
        <TouchableOpacity onPress={this.handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
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
  userName: {
    fontSize: 24,
    color: '#444',
    fontFamily: 'SanomatSansRegular',
    marginTop: 35
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    borderRadius: 20,
    width: 150,
    alignItems: 'center',
    padding: 3,
    marginTop: 30
  },
  logoutText: {
    fontFamily: 'SanomatSansBold',
    color: '#fff'
  }
})