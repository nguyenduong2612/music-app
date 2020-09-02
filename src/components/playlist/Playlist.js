import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PlaylistItem from './PlaylistItem'

export default class Playlist extends Component {
	render() {
		const { state, setParams, navigate } = this.props.navigation;
		const params = state.params || {};
		const songs = params.songs
		// const songs = JSON.stringify(navigation.getParam('songs', 'default'));
		// console.log(songs)
    return (
			<View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
				{
					songs != undefined ? songs.map(song => {
						return <PlaylistItem 
										style={{ fontFamily: 'SanomatSansRegular'}}
										key={song.title}
										title={song.title}
										author={song.author}
										thumbnails={song.thumbnails}
									/>
					}) : <PlaylistItem thumbnails='https://i.pinimg.com/564x/bd/2b/50/bd2b502137f9397cb0edd383ce9d130c.jpg' title='Kanna The Cute Dragon' author='kanna' />
				}
			</View>
    );
  }
}