import { Audio } from 'expo-av'
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Keyboard } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import YouTubeAPI from 'youtube-api-search'
import Youtube from 'youtube-stream-url'
import { YOUTUBE_API_KEY, YOUTUBE_API_KEY_1, YOUTUBE_API_KEY_2 } from '@env';

const keylist = [YOUTUBE_API_KEY, YOUTUBE_API_KEY_1, YOUTUBE_API_KEY_2];

export default class Home extends Component { 
  constructor (props) {
    super(props)
    this.state = {
      loopMode: 'one',
      isShuffle: false,
      search: "",
      isPlaying: false,
      playbackInstance: null,
      currentIndex: 0,
      songs: []
    }
  }

  componentDidMount = async() => {
    this.focusListener = this.props.navigation.addListener('focus', () => {   //handle click from playlist
      if (this.props.route.params != undefined && this.props.route.params.click == true) {
        this.handlePlaySongFromPlaylist()
        this.props.route.params.click = false
      }
    });
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
    let { loopMode, playbackInstance } = this.state
    if (playbackStatus.didJustFinish) {
      if (loopMode == 'off') {
        await playbackInstance.pauseAsync()
        this.setState({ isPlaying: false })
      } else if (loopMode == 'all') {
        this.handleNextTrack()
      } else if (loopMode == 'one') {
        await playbackInstance.replayAsync()
      }
    }
  };

  loadAudio = async() => {
    const {currentIndex, isPlaying} = this.state

    try {
      const playbackInstance = new Audio.Sound()
      const source = {
        uri: this.state.songs[currentIndex].uri
      }
  
      const status = {
        shouldPlay: isPlaying
      }

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)     
      await playbackInstance.loadAsync(source, status, false)
      this.setState({playbackInstance})
    } catch (e) {
      console.log(e)
    }
  }

  handlePlaySongFromPlaylist = async() => {
    let { playbackInstance } = this.state
    let songIndex = this.props.route.params.songIndex
    await playbackInstance.unloadAsync()

    this.setState({ currentIndex: songIndex })
    this.loadAudio().then(() => {
      let { playbackInstance } = this.state
      playbackInstance.playAsync()
      this.setState({ isPlaying: true })
    })
  }

  updateSearch = (search) => {
    this.setState({ search });
  };

  handleSearch = async(e) => { 
    if (this.state.search.trim() !== '' && this.state.search.trim() !== ' ') {
      Keyboard.dismiss()
      const ytKey = keylist[Math.floor(Math.random() * keylist.length)];

      YouTubeAPI({key: ytKey, term: this.state.search}, (videos) => {
        const videoId = videos[0].id.videoId
        this.setState({
          search: ''
        })
        let ytUrl = `https://www.youtube.com/watch?v=${videoId}`
        console.log(ytUrl)

        Youtube.getInfo({url: ytUrl})
          .then(async(video) => {
            console.log(video)
            const uri = video.formats[0].url
            const { isPlaying } = this.state

            const song = {
              thumbnails: videos[0].snippet.thumbnails.medium.url,
              uri: video.formats[0].url,
              title:  videos[0].snippet.title,
              author: videos[0].snippet.channelTitle
            }

            this.setState(prevState => { 
              const songs = prevState.songs.concat(song)
              return {
                songs
              }}, () => {
                console.log(this.state.songs)
                const { navigate } = this.props.navigation;
                navigate('Playlist', {  
                  songs: this.state.songs
                })
                if (!isPlaying) {
                  try {
                    this.loadAudio().then(() => {
                      const { playbackInstance } = this.state
                      playbackInstance.playAsync()
                      this.setState({ isPlaying: true })
                    })
                  } catch (e) {
                    console.log(e);
                  };
                }
              }
            );
          })
      })
    }
  }

  handlePlayPause = async() => {
    const { isPlaying, playbackInstance } = this.state
    if (!playbackInstance) return
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

    this.setState({
      isPlaying: !isPlaying
    })
  }

  handlePreviousTrack = async () => {
    let { playbackInstance, currentIndex, songs } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      currentIndex > 0 ? (currentIndex -= 1) : (currentIndex = songs.length - 1)
      this.setState({
        currentIndex
      })
      this.loadAudio().then(() => {
        let { playbackInstance } = this.state
        playbackInstance.playAsync()
        this.setState({ isPlaying: true })
      })
    }
  }

  handleNextTrack = async() => {
    let { playbackInstance, currentIndex, songs } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      if (this.state.isShuffle) {
        let indexArray = [...Array(songs.length).keys()]      //create index array [0...songs.length]
        indexArray.splice(currentIndex, 1)                    //remove index of current song
        currentIndex = indexArray[Math.floor(Math.random() * indexArray.length)]    //get new random index from the array
        this.setState({ currentIndex })
      } else {
        currentIndex < songs.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
        this.setState({ currentIndex })
      }

      this.loadAudio().then(() => {
        let { playbackInstance } = this.state
        playbackInstance.playAsync()
        this.setState({ isPlaying: true })
      })
    }
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
    let { isShuffle, songs } = this.state

    this.setState({
      isShuffle: !isShuffle
    })
  }


  render() {
    let { currentIndex , songs } = this.state
    if (songs[currentIndex] != undefined) {
      var thumbnails = songs[currentIndex].thumbnails
      var title = songs[currentIndex].title
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
          <Text style={[styles.trackInfoText, styles.largeText]}>
            {title}
          </Text>
        </View> 
        <View style={styles.controls}>
          <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
            <Ionicons name='ios-skip-backward' size={40} color='#444' style={styles.controlbtn} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
            {this.state.isPlaying ? (
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

const styles = StyleSheet.create({
  searchbtn: {
    position: 'absolute',
    top: 25,
    right: 20
  },
  searchbar: {
    fontSize: 18,
    fontFamily: 'SanomatSansRegular',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    width: "100%"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  albumCover: {
    width: 260,
    height: 260,
    borderRadius: 25
  },
  controls: {
    flexDirection: 'row'
  },
  control: {
    margin: 20
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
    fontSize: 20,
    fontFamily: 'SanomatSansBold',
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 50
  },
  trackInfo: {
    width: '70%',
    minHeight: '20%'
  },
  bottomBar: {
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row'
  },
  bottomBarItem: {
    paddingHorizontal: 25,
    marginHorizontal: 5,
    paddingBottom: 10
  }
})
