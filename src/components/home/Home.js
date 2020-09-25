import { Audio } from 'expo-av'
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Keyboard, Dimensions } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import YouTubeAPI from 'youtube-api-search'
import ytdl from "react-native-ytdl"
import { YOUTUBE_API_KEY, YOUTUBE_API_KEY_1, YOUTUBE_API_KEY_2 } from '@env';

const keylist = [YOUTUBE_API_KEY, YOUTUBE_API_KEY_1, YOUTUBE_API_KEY_2];
export default class Home extends Component { 
  constructor (props) {
    super(props)
    this.state = {
      loopMode: 'one',
      isShuffle: false,
      search: ""
    }
  }

  componentDidMount = async() => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false
      })
    } catch (e) {
      console.log(e)
    }
  }

  onPlaybackStatusUpdate = async(playbackStatus) => {
    let { loopMode } = this.state
    let { playbackInstance } = this.props
    if (playbackStatus.didJustFinish) {
      if (loopMode == 'off') {
        await playbackInstance.pauseAsync()
        this.props.updateIsPlaying(false)
      } else if (loopMode == 'all') {
        this.handleNextTrack()
      } else if (loopMode == 'one') {
        await playbackInstance.replayAsync()
      }
    }
  };

  loadAudio = async(song) => {
    try {
      this.props.updateNowPlaying(song)
      this.props.updateIsPlaying(true)

      const playbackInstance = new Audio.Sound()
      const source = {
        uri: song.uri
      }
  
      const status = {
        shouldPlay: true
      }

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)     
      await playbackInstance.loadAsync(source, status, false)
      
      this.props.updatePlaybackInstance(playbackInstance)
    } catch (e) {
      console.log(e)
    }
  }

  updateSearch = (search) => {
    this.setState({ search });
  };

  handleSearch = (e) => { 
    if (this.state.search.trim() !== '' && this.state.search.trim() !== ' ') {
      Keyboard.dismiss()
      const ytKey = keylist[Math.floor(Math.random() * keylist.length)];

      YouTubeAPI({key: ytKey, term: this.state.search}, async(videos) => {
        const videoId = videos[0].id.videoId
        this.setState({
          search: ''
        })
        let ytUrl = `https://www.youtube.com/watch?v=${videoId}`
        //console.log(videoId)

        let info = await ytdl.getInfo(ytUrl)
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
        //console.log(audioFormats)

        const {songs, nowPlaying} = this.props

        const song = {
          thumbnails: videos[0].snippet.thumbnails.medium.url,
          uri: audioFormats[0].url,
          title:  videos[0].snippet.title,
          author: videos[0].snippet.channelTitle
        }

        if (!nowPlaying) {
          this.loadAudio(song)
        }
  
        this.props.updateSongs(songs.concat(song))
        console.log(this.props.songs)

      })
    }
  }

  handlePlayPause = async() => {
    let { playbackInstance, songs, isPlaying, nowPlaying } = this.props
    if (!nowPlaying) return

    if (playbackInstance == null) {
      this.loadAudio(nowPlaying)
    } else {
      isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
      this.props.updateIsPlaying(!isPlaying)
    }
  }

  lastTap = null;
  handlePreviousTrack = async () => {
    let {currentIndex, songs, playbackInstance, nowPlaying} = this.props
    if (songs.length == 0) return
    if (!nowPlaying) return

    const now = Date.now()
    const DOUBLE_PRESS_DELAY = 400;
    if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {    // double tap
      if (playbackInstance != null) {
        await playbackInstance.unloadAsync()
      }
      currentIndex > 0 ? (currentIndex -= 1) : (currentIndex = songs.length - 1)
  
      this.loadAudio(songs[currentIndex])
      this.props.updateCurrentIndex(currentIndex)
    } else {    // single tap
      this.lastTap = now
      playbackInstance.replayAsync()
    }

  }

  handleNextTrack = async() => {
    let {currentIndex, songs, playbackInstance, nowPlaying} = this.props
    if (songs.length == 0) return
    if (!nowPlaying) return

    if (playbackInstance) {
      await playbackInstance.unloadAsync()
    }

    if (this.state.isShuffle) {
      let indexArray = [...Array(songs.length).keys()]      //create index array [0...songs.length]
      indexArray.splice(currentIndex, 1)                    //remove index of current song
      currentIndex = indexArray[Math.floor(Math.random() * indexArray.length)]    //get new random index from the array
      //await this.props.updateNowPlaying(songs[currentIndex])
    } else {
      currentIndex < songs.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
      //await this.props.updateNowPlaying(songs[currentIndex])
    }

    this.loadAudio(songs[currentIndex])
    this.props.updateCurrentIndex(currentIndex)
  }

  handleChangeloopMode = () => {
    let loopModeList = ['all', 'one', 'off']
    let { loopMode } = this.state
    let modeIndex = loopModeList.indexOf(loopMode)

    modeIndex < loopModeList.length - 1 ? (modeIndex += 1) : (modeIndex = 0)
    this.setState({
      loopMode: loopModeList[modeIndex]
    })
  }

  handleChangeShuffle = () => {
    let { isShuffle } = this.state

    this.setState({ isShuffle: !isShuffle })
  }

  render() {
    let { currentIndex , songs, nowPlaying } = this.props
    if (nowPlaying) {
      var thumbnails = nowPlaying.thumbnails
      var title = nowPlaying.title
    } else {
      var thumbnails = 'https://i.pinimg.com/564x/bd/2b/50/bd2b502137f9397cb0edd383ce9d130c.jpg'
      var title = 'Kanna The Cute Dragon'
    }
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchbar}
          placeholder="Adding a song"
          onChangeText={this.updateSearch}
          onSubmitEditing={this.handleSearch}
          returnKeyType='search'
          value={this.state.search}
        />
        <TouchableOpacity style={styles.searchbtn} onPress={this.handleSearch}>
          <Ionicons name='ios-add' size={40} color='#444' />
        </TouchableOpacity>

        <Image
          style={styles.albumCover}
          source={{ uri: thumbnails }}
        />
        <View style={styles.trackInfo}>
          <Text numberOfLines={3} ellipsizeMode='tail' style={[styles.trackInfoText, styles.largeText]}>
            {title}
          </Text>
        </View> 
        <View style={styles.controls}>
          <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
            <Ionicons name='ios-skip-backward' size={40} color='#444' style={styles.controlbtn} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
            {this.props.isPlaying ? (
              <Ionicons name='md-pause' size={50} color='#444' style={styles.pausebtn} />
                ) : (
              <Ionicons name='ios-play-circle' size={80} color='#444' />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
            <Ionicons name='ios-skip-forward' size={40} color='#444' style={styles.controlbtn} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarItem}>
            <Ionicons name="ios-heart" size={25} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleChangeloopMode} style={styles.bottomBarItem}>
            {
              this.state.loopMode == 'all' ? (
                <MaterialCommunityIcons name="repeat" size={25} color="#444" />
              ) : this.state.loopMode == 'one' ? (
                <MaterialCommunityIcons name="repeat-once" size={25} color="#444" />
              ) : (
                <MaterialCommunityIcons name="repeat-off" size={25} color="#444" />
              )
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleChangeShuffle} style={styles.bottomBarItem}>
            {
              !this.state.isShuffle ? (
                <MaterialCommunityIcons name="shuffle-disabled" size={25} color="#444" />
              ) : (
                <MaterialCommunityIcons name="shuffle" size={25} color="#444" />
              )
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarItem}>
            <Ionicons name="ios-more" size={25} color="#444" />
          </TouchableOpacity>
        </View>
      </View>
    )
  };
};

const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  searchbtn: {
    position: 'absolute',
    top: height * 0.025,
    right: 20
  },
  searchbar: {
    fontSize: height * 0.025,
    fontFamily: 'SanomatSansRegular',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    width: "100%"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  albumCover: {
    width: height * 0.34,
    aspectRatio: 1,
    borderRadius: 25
  },
  controls: {
    flexDirection: 'row'
  },
  control: {
    marginHorizontal: 20,
    marginVertical: height * 0.04
  },
  controlbtn: {
    lineHeight: 82
  },
  pausebtn: {
    lineHeight: 82,
    width: 65,
    fontSize: 50,
    textAlign: "center"
  },
  trackInfoText: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#444'
  },
  largeText: {
    fontSize: height * 0.0275,
    fontFamily: 'SanomatSansBold',
    textAlign: 'center',
    lineHeight: height * 0.035,
    minHeight: 70,
    marginTop: height * 0.06
  },
  trackInfo: {
    width: '70%'
  },
  bottomBar: {
    alignItems: 'center',
    paddingTop: height * 0.01,
    flexDirection: 'row'
  },
  bottomBarItem: {
    paddingHorizontal: 25,
    marginHorizontal: 5,
    paddingBottom: 10
  }
})
