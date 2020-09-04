import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class PlaylistItem extends Component {

  handlePlaySong = () => {
    this.props.onPlay(this.props.songIndex)
  }

  handleRemoveSong = () => {
    this.props.onRemove(this.props.songIndex)
  }

  render() {
    return (
      <View  style={styles.itemWrapper}>
        <Image style={styles.thumbnails} source={{ uri: this.props.thumbnails }}/>
        <TouchableOpacity onPress={this.handlePlaySong} style={styles.textWrapper}>
          <Text style={styles.title}>{`${this.props.title.substring(0, 50)}...`}</Text>
          <Text style={styles.author}>{`${this.props.author}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleRemoveSong} style={styles.more}>
          <Ionicons name='ios-close-circle' size={24} color='#444' />
        </TouchableOpacity>
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
    paddingVertical: 15,
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
    marginRight: '30%'
  },
  title: {
    fontSize: 16,
    fontFamily: 'SanomatSansRegular',
    lineHeight: 20
  },
  author: {
    fontFamily: 'SanomatSansRegular',
    paddingTop: 2
  },
  more: {
    position: 'absolute',
    paddingHorizontal: 10,
    right: 10,
    top: 25
  }
})