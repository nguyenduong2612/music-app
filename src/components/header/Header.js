import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';

const Header = () => (
  <View style={styles.container}>
    <Text style={styles.message}>asda</Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
  },
  
});