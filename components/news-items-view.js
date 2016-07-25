import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	ListView,
	ScrollView,
	TouchableHighlight,
	AsyncStorage,
} from 'react-native';

import Button from 'react-native-button';
import GiftedSpinner from 'react-native-gifted-spinner';

import moment from 'moment';

export default class NewsItems extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  title: 'Ice Peak',
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          news: {},
          loaded: false
		}
	}

	componentDidMount() {
		AsyncStorage.getItem('newsItems').then((news) => {
			let items = JSON.parse(news);
			console.log('-------------------');
			console.log(items);
			if(items) {
				AsyncStorage.getItem('time').then((timeStr) => {
					let time = JSON.parse(timeStr);
					let cache = time.cache;
					let current = moment();

					let diff = current.diff(cache, 'days');
					if(diff > 0) {
						this.getNews();
					} else {
						this.updateNewsItemsUI(items);
					}
				})
			} else {
				this.getNews();
			}
		}).done();
	}

	renderNews(news) {
		return (
			<TouchableHighlight onPress={this.viewPage.bind(this, news.url)}
				underlayColor={'#eeeeee'}
				style={styles.button}
			>
				<View style={styles.newsItem}>
					<Text style={styles.newsItemText}>{news.title}</Text>
				</View>
			</TouchableHighlight>
		)
	}

	viewPage(url) {
		this.props.navigator.push({
			name: 'webPage',
			url: url
		});
	}

	updateNewsItemsUI(newsItems) {
		console.log('++++++++++++++++++++++');
		console.log(newsItems);
		console.log(newsItems.length);

		if(newsItems.length == 5) {
			console.log('00000000000000000000');
			let ds = this.state.dataSource.cloneWithRows(newsItems);
			this.setState({
				'news': ds,
				'loaded': true
			})
		}
	}

	updateNewsItemsDB(newsItems) {
		if(newsItems.length == 5) {
			AsyncStorage.setItem('newsItems', JSON.stringify(newsItems));
		}
	}

	getNews() {
		let newsItems = [];
		console.log('------------+++++++++++++');
		AsyncStorage.setItem('time', JSON.stringify({'cache': moment()}));

		// fetch('http://localhost:8081/data/topstories.json')
		fetch('https://hacker-news.firebaseio.com/v0/beststories.json')
		.then((response) => response.json())
		.then((stories) => {
			// let news = data;
			
			console.log('----------------');
			console.log(stories);
			console.log('----------------');
			
			// this.updateNewsItemsUI(news);
			// this.updateNewsItemsDB(news);
			
			stories.each((story) => {
				// let url = "http://localhost:8081/data/item/" + story + ".json"
				let url = "https://hacker-news.firebaseio.com/v0/item/" + story + ".json"

				fetch(url).then((response) => response.json()).then((content) => {
					newsItems.push(content);
					this.updateNewsItemsUI(newsItems);
					this.updateNewsItemsDB(newsItems);
				})
			})

		}).catch((error) => {
			console.log(error);
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.headerItem}>
						<Text style={styles.headerText}>{this.state.title}</Text>
					</View>
					<View style={styles.headerItem}>
						{
							!this.state.loaded && <GiftedSpinner />
						}
					</View>
				</View>

				<View style={styles.body}>
					<ScrollView ref="scrollView">
						{
							this.state.loaded &&
							<ListView
								initialListSize={1}
								dataSource={this.state.news}
								style={styles.news}
								renderRow={this.renderNews.bind(this)}
							></ListView>
						}
					</ScrollView>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	header: {
		backgroundColor: 'orangered',
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row'
	},

	body: {
		flex: 9,
		backgroundColor: '#eeeeee'
	},

	headerItem: {
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center'
	},

	headerText: {
		color: '#ffffff'
	},

	button: {
		borderBottomWidth: 1,
		borderBottomColor: '#cccccc',
	},

	newsItem: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 15,
		paddingBottom: 15,
	},

	newsItemText: {
		color: '#333333',
		fontSize: 16,
	}
})