import React, {Component} from 'react';

import {
	View,
	StyleSheet,
	Text,
	WebView
} from 'react-native';

import _ from 'lodash';
import Button from 'react-native-button';
import GiftedSpinner from 'react-native-gifted-spinner';

export default class WebPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.headerItem}>
						<Button style={styles.button} onPress={this.back.bind(this)}>Back</Button>
					</View>	
					<View style={styles.headerItem}>
						<Text style={styles.pageTitle}>{this.truncate(this.state.pageTitle)}</Text>
					</View>	
					<View style={[styles.headerItem, styles.spinner]}>
					{
						this.state.isLoading && <GiftedSpinner />
					}
					</View>
				</View>

				<View style={styles.body}>
					<WebView 
					url={this.props.url}
					onNavigationStateChange={this.onNavigationStateChange.bind(this)}
					></WebView>						
				</View>	
			</View>
		);
	}

	truncate(str) {
		return _.truncate(str, 20);
	}

	onNavigationStateChange(state) {
		if(!state.loading) {
			this.setState({
				isLoading: false,
				pageTitle: state.title
			})
		}
	}

	back() {
		this.props.navigator.pop();
	}
}