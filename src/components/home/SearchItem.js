import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ytdl from "react-native-ytdl"

export default class SearchItem extends Component {

  handleAddToPlaylist = async() => {
    this.props.closePopup()
    let ytUrl = `https://www.youtube.com/watch?v=${this.props.id}`

    let info = await ytdl.getInfo(ytUrl)
    let audioFormats = ytdl.filterFormats(info.formats, 'audioonly')

    const song = {
      url: ytUrl,
      thumbnails: this.props.thumbnails,
      uri: audioFormats[0].url,
      title:  this.props.title,
      author: this.props.author
    }
    this.props.addSongToPlaylist(song)
  }

  render() {
    return (
      <View style={styles.itemWrapper}>
        <Image style={styles.thumbnails} source={{ uri: this.props.thumbnails }}/>
        <TouchableOpacity onPress={this.handleAddToPlaylist} style={styles.textWrapper}>
          <Text style={styles.title}>{`${this.props.title.substring(0, 50)}...`}</Text>
          <Text style={styles.author}>{`${this.props.author}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleAddToPlaylist} style={styles.add}>
          <Ionicons name='ios-add' size={30} color='#444' />
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
  add: {
    position: 'absolute',
    paddingHorizontal: 10,
    right: 10,
    top: 25
  }
})