import React, { Component } from 'react'
import { Audio } from 'expo-av'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import PlaylistItem from './PlaylistItem'
import Home from '../home/Home'

export default class Playlist extends Component {
	constructor (props) {
		super(props)
	}
	
	handlePlaySong = (songIndex) => {
		// sending songIndex and click event to home
		const { navigate } = this.props.navigation;
		navigate('Home', {  
			songIndex: songIndex,
			click: true
		}) 
	}

	render() {		
		if (this.props.route.params != undefined) {
			var songs = this.props.route.params.songs
		}
    return (
			<View style={{ flex: 1, alignItems: 'center', paddingTop: 10, backgroundColor: '#fff' }}>
				
				{
					songs != undefined ? songs.map((song, index) => {
						return <PlaylistItem 
										key={index}
										songIndex={index}
										title={song.title}
										author={song.author}
										thumbnails={song.thumbnails}
										onClick={this.handlePlaySong}
									/>
					}) : <Text style={{ paddingTop: 10, fontFamily: 'SanomatSansRegular' }}>Playlist is empty</Text>
				}
			</View>
    );
  }
}