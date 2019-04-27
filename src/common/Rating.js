
/**
 * @param {最大星级,如果不传,默认是5,值为5} this.props.maxRating
 * @param {星级,如果不传,默认是满级,值为5} this.props.rating
 */
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as constants from '../constants/index'


export default class Rating extends Component {
    constructor(props) {
        super(props);
        this.state ={}
    }

    componentWillMount() {
        // 定义总星级
        this.maxRating = this.props.maxRating ? this.props.maxRating : 5;
        // @param {星级,如果不传,默认是满级,值为5} this.props.rating
        this.rating = this.props.rating <= this.maxRating && this.props.rating >= 0 ? this.props.rating : 0;
        this.ratingArr = []
        this.starColor = this.props.starColor ? this.props.starColor : '#ff6600';
        this.initPage()
    }

    componentWillReceiveProps = (nextProps) => {
        this.maxRating = nextProps.maxRating ? nextProps.maxRating : 5;
        this.rating = nextProps.rating ? (nextProps.rating >= 0 && nextProps.rating <= this.maxRating ? nextProps.rating : this.maxRating) : 0;
        this.starColor = nextProps.starColor ? nextProps.starColor : '#ff6600';
        this.initPage()
    }
    // 处理函数
    initPage = () => {
        this.setRatingChange()
    }
    // 改变状态
    setRatingChange = () => {
        this.ratingArr = Array.from({ length: this.maxRating }).map((item, index) => {
            if (this.rating < index + 1) {
                if(this.rating > index) {
                    return {
                        status: 1,
                        index,
                        level: index + 1
                    }
                }
                return {
                    status: 0,
                    index,
                    level: index + 1
                }
            } else {
                return {
                    status: 2,
                    index,
                    level: index + 1
                }
            }
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.ratingWrap}>
                {
                    this.ratingArr.map((item, index) => {
                        let renderItem = null;
                        switch(item.status) {
                            case 0: 
                                renderItem = <Icon key={item.level} name="md-star-outline" size={16} color={this.starColor} />
                                break;
                            case 1: 
                                renderItem = <Icon key={item.level} name="md-star-half" size={16} color={this.starColor} />
                                break;
                            case 2: 
                                renderItem = <Icon key={item.level} name="md-star" size={16} color={this.starColor} />
                                break;
                        }
                        return renderItem;
                    })
                }
                </View>
                <Text style={{marginLeft: 8, fontSize: 12, color: constants.GRAY_DARK}}>{`${this.rating} 分`}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    ratingWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 80,
    }
})