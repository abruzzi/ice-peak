import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  View
} from 'react-native';

import NewsItems from './components/news-items-view';
import WebPage from './components/webpage-view';

class IcePeak extends Component {
  constructor(props) {
    super(props);
    this.routes = {
      'newsItems': NewsItems,
      'webPage': WebPage
    }
  }

  renderScene(route, navigator) {
    let Component = this.routes[route.name];
    return (<Component {...route.params} navigator={navigator} />);
  }

  render() {
    return (
      <Navigator style={styles.container} 
      initialRoute={{name: 'newsItems', url: ''}}
      renderScene={this.renderScene.bind(this)}
      configureScene={() => { return Navigator.SceneConfigs.FloatFromRight; }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

AppRegistry.registerComponent('IcePeak', () => IcePeak);
