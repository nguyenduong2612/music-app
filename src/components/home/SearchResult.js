import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import SearchItem from './SearchItem'

export default class SearchResult extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Search results</Text>
        {
          this.props.videos.map((video, index) => {
            return  <SearchItem 
                      key={index}
                      id={video.id.videoId}
                      title={video.snippet.title}
                      author={video.snippet.channelTitle}
                      thumbnails={video.snippet.thumbnails.medium.url}
                      addSongToPlaylist={this.props.addSongToPlaylist}
                      closePopup={this.props.closePopup}
                    />
          })
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 25
  },
  header: {
    fontSize: 20,
    fontFamily: 'SanomatSansRegular',
    paddingTop: 15,
    paddingBottom: 10
  }
})