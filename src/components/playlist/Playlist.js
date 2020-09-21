import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import PlaylistItem from './PlaylistItem'

export default class Playlist extends Component {
	constructor (props) {
		super(props)
	}
	
	handlePlaySong = async(songIndex) => {
		const {playbackInstance} = this.props

		if (playbackInstance) {
			await playbackInstance.unloadAsync()
		}
		
		const source = {
			uri: this.props.songs[songIndex].uri
		}
  
		const status = {
			shouldPlay: true
		}
  
		await playbackInstance.loadAsync(source, status, false)
		this.props.updatePlaybackInstance(playbackInstance)
		this.props.updateCurrentIndex(songIndex)
	}

	handleRemoveSong = (songIndex) => {
		let { songs, currentIndex } = this.props

		if (songIndex < currentIndex) {
			currentIndex -= 1
		} else if (songIndex == currentIndex) {
			return
		}

		songs.splice(songIndex, 1)
		this.props.updateCurrentIndex(currentIndex)
		this.props.updateSongs(songs)
	}

	render() {		
    return (
			<ScrollView contentContainerStyle={styles.container}>
				{
					this.props.songs.length != 0 ? this.props.songs.map((song, index) => {
						return <PlaylistItem 
										key={index}
										songIndex={index}
										title={song.title}
										author={song.author}
										thumbnails={song.thumbnails}
										onPlay={this.handlePlaySong}
										onRemove={this.handleRemoveSong}
									/>
					}) : <Text style={{ paddingTop: 10, fontFamily: 'SanomatSansRegular' }}>Playlist is empty</Text>
				}
			</ScrollView>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center', 
		paddingVertical: 10, 
		backgroundColor: '#fff'
	}
})