import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class PlaylistItem extends Component {
  render() {
    return (
      <View style={styles.itemWrapper}>
        <Image style={styles.thumbnails} source={{ uri: this.props.thumbnails }}/>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{`${this.props.title.substring(0, 50)}...`}</Text>
          <Text style={styles.author}>{`${this.props.author}`}</Text>
        </View>
        <Ionicons name='ios-more' size={20} color='#444' style={styles.more}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    height: 85,
    width: '100%',
    display: 'flex',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  thumbnails: {
    width: 50,
    height: 50,
    borderRadius: 7
  },
  textWrapper: {
    position: 'absolute',
    left: 82,
    top: 12,
    paddingRight: '30%'
  },
  title: {
    fontSize: 16,
    lineHeight: 20
  },
  author: {
    paddingTop: 2
  },
  more: {
    position: 'absolute',
    right: 20,
    top: 25
  }
})