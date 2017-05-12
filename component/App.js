import React, {Component} from 'react'
import {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    Dimensions,
    Image,
    Animated
} from 'react-native'

import data from '../data'
import Navbar from './Navbar'

const {width, height} = Dimensions.get('window')

export default class App extends Component {
    constructor(props){
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            isLoaded: false,
            isOpenMenu: false,
            dataSource: ds.cloneWithRows(data),
            rotateY: new Animated.Value(0),
            translateX: new Animated.Value(width),
            menuAnimation: new Animated.Value(0)
        }
    }

    showMenu(){
      if(this.state.isOpenMenu) {
        this.setState({ isOpenMenu: false })
        Animated.parallel([
          Animated.timing(
            this.state.translateX, {
              toValue: width
            }
          ),
          Animated.timing(
            this.state.rotateY, {
              toValue: 0
            }

          )
        ]).start()

      } else {
        this.setState({ isOpenMenu: true })
        Animated.parallel([
          Animated.timing(
            this.state.translateX, {
              toValue: width * 0.60
            }
          ),
          Animated.timing(
            this.state.rotateY, {
              toValue: 1
            }
          ),
          Animated.timing(
            this.state.menuAnimation, {
              toValue: 1,
              duration: 800
            }
          )
        ]).start()
      }

    }

    closeMenu(){
      this.setState({isOpenMenu: false});
      Animated.parallel([
        Animated.timing(
          this.state.translateX, {
            toValue: width
          }
        ),
        Animated.timing(
          this.state.rotateY, {
            toValue: 0
          }
        ),
        Animated.timing(
          this.state.menuAnimation, {
            toValue: 0,
            duration: 300
          }
        )
      ]).start()
    }

    renderRow(rowData){
      const img = rowData.image;
      return (
        <TouchableHighlight style={styles.containerCell}>
          <View>
            <Image
              style={{ width: width, height: 180 }}
              source={{ uri: img }}
            />
            <View style={styles.footerContainer}>
              <View
                style={styles.imageUser}
              >
                <Image
                  style={styles.imageAvatar}
                  source={{ uri: rowData.user }}
                />
              </View>
              <View style={styles.footertextContainer}>
                <Text style={styles.text}>{rowData.food}</Text>
                <Text style={[styles.text, styles.textTitle]}>{rowData.title}</Text>
                <Text style={[styles.text, styles.textBy]}>By {rowData.by}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>

      )
    }



    render(){
        return (
            <View style={styles.container}>
              <Animated.View style={[styles.content, {
                width: width,
                backgroundColor: '#402a38',
                flex: 1,
                transform: [
                  {
                    perspective: 450
                  },
                  {
                    translateX: this.state.translateX.interpolate({
                      inputRange: [0, width],
                      outputRange: [width, 0]
                    })
                  },
                  {
                    rotateY: this.state.rotateY.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-10deg']
                    })
                  }
                ]
              }]}>
                {this.state.isOpenMenu ? <Navbar icon="times" showMenu={this.closeMenu.bind(this)}/> : <Navbar icon="bars" showMenu={this.showMenu.bind(this)}/>}
                <ListView
                  style={styles.listContainer}
                  renderRow={this.renderRow.bind(this)}
                  dataSource={this.state.dataSource}
                />
              </Animated.View>
              <Animated.View style={[styles.menu, {
                opacity: this.state.menuAnimation,
                position: 'absolute',
                width:140,
                left: 0,
                top: 100,
                backgroundColor: 'transparent'
              }]}>
                <Text style={styles.textMenu}>Home</Text>
                <Text style={styles.textMenu}>New Recipies</Text>
                <Text style={styles.textMenu}>Recipies</Text>
                <Text style={styles.textMenu}>Profile</Text>
                <Text style={styles.textMenu}>Setting</Text>
              </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4e0032'
    },
    content: {
        zIndex: 1
    },
    footerContainer: {
       flexDirection: 'row',
       paddingHorizontal: 10,
       paddingVertical: 10,
       backgroundColor: '#4e0032'
    },
    imageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5
    },
    listContainer: {
        marginHorizontal: 10
    },
    text: {
        color: '#fff'
    },
    containerCell: {
        marginBottom: 10
    },
    textTitle: {
        fontSize: 13
    },
    textBy: {
        fontSize: 12
    },
    textMenu: {
        fontSize: 20,
        color: '#fff'
    }
})
