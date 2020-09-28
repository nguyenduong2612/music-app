import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, Dimensions } from 'react-native'
import Toast, {DURATION} from 'react-native-easy-toast'
import PlaylistItem from './PlaylistItem'

export default class Playlist extends Component {
	constructor (props) {
		super(props)
	}
	
	handlePlaySong = async(songIndex) => {
		const {playbackInstance, songs} = this.props
		this.props.updateNowPlaying(songs[songIndex])
		this.props.updateCurrentIndex(songIndex)
		this.props.updateSongs(songs)
		this.props.updateIsPlaying(true)

		if (playbackInstance != null) {
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
		
	}

	handleRemoveSong = (songIndex) => {
		let { songs, currentIndex } = this.props

		if (songIndex < currentIndex) {
			currentIndex -= 1
		}

		songs.splice(songIndex, 1)
		this.props.updateSongs(songs, false)
		this.refs.toast.show('Removed successfully', 2500);
	}

	render() {
    return (
			<ScrollView contentContainerStyle={styles.container}>
				<Toast 
					ref="toast"
					opacity={0.75}
					positionValue={150}
          textStyle={styles.toast}
				/>
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
							pad		/>
					}) : <Text style={{ paddingTop: 10, fontFamily: 'SanomatSansRegular' }}>Playlist is empty</Text>
				}
			</ScrollView>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		minHeight: Dimensions.get('window').height - 55,
		alignItems: 'center', 
		paddingVertical: 10, 
		backgroundColor: '#fff'
	},
	toast: {
		fontFamily: 'SanomatSansRegular',
		color: 'white',
		fontSize: 16,
		paddingHorizontal: 15
	}
})