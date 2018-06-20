import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SafeAreaView from 'react-native-safe-area-view'

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  ListView,
  ScrollView,
  Platform
} from 'react-native'

import Fuse from 'fuse.js'

import m49List from '../data/m49'
import { getHeightPercent } from './ratio'
import CloseButton from './CloseButton'
import countryPickerStyles from './CountryPicker.style'
import KeyboardAvoidingView from './KeyboardAvoidingView'

let countries = null
let Emoji = null
let styles = {}

//let isEmojiable = Platform.OS === 'ios'
let isEmojiable = false

const FLAG_TYPES = {
  flat: 'flat',
  emoji: 'emoji'
}

const NO_FLAG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAYAAABe3VzdAAAABHNCSVQICAgIfAhkiAAAA3dJREFUWIXtlt1P01cYxz+/UvpmdCpgN2ylvDhwvOmIDhkyEzI7XqYCixde7HJXy/6Pxex2xm0Xu1dSC103Y2MUCsyhSSsQ0KxYKI1IEQpSaH9tf2c3jk23hb5YxwXfy/Occ/I5T57nex5JCCHYxlL93wBbaQcwW217QHVGp0SM4IgD281xIrUX+arrMHqizA33YRtZwdLaTduxggwvf1mZZVDScvBEM9XFe2HCyUBQRkg6TCeaqCqpp7n+9cBBphl8IdVbdbSXTdLfN8zRL05j/HtQifB4wIF7QcduESZqbOFsSymGNFOSXQ1K+RhPnqUhPkz/6DOSmwHB+u9OeieMWLvPcb7HStFYL07fBumabvZNojlIy6c1rNz+Ce+K8mIxTmjCD6Yy9qoB9X4qzDAzGSLxxgGR0Je20l4xj+uXKdaU/9yWkV6PzUi7qLSeoXh2hLGwAuRTdMSMCEyznAASy/gCEiXvFaVd9BkCyjwZdTMxM4b7/gJxQLWnlvZWExoBIGF4t5PzVUF+vnYde+8NQrXdtJfp006ktDMsZKksAWWe3rNz5dJl7oSSW2/PQKnVrIgSGLRjuz2FXFJD+R4VSmQOv7qNL3saMA0FcwKXOqCkw9x0mmqPn8XmTrrKtYiID/f4LlRpO1suAF+VsspDT5TaxnLylbnNZbHuZ9B5l2caFcuzq5g6L/KxRY8UX+Ce4wbT6t2sT3mZUZdz/KNPOPN+4ZYA6dWgiBFwO7DZ7LjGF5Ff6X85NMl0opRTHT30NCbx/hpEBqKPXdwKVWHtOMeFjlK0hkqajm4NB+lmUNJibu6ky7LG3b6pf4S1JW18fmABn2cIv+85spxEACqNnrx4hJgiEBEZbcE+dCkaYmZdnFfAB10fcuCl5ymsPXLw/Y9DPC9uoLF63+brNYesfFYb5Po1JyPhY1zoKM8x4L8qQejBJLGKk9S9o0dKir8mF5UWvYggFVo4Ul+JMVW61AETLHqHmQxHmR25w9jSn54ns/DgPv7VZR6OPkJbV412yoXL/RtjQZlkyIsnGEWJLzH7VCIvMIz9h2/4+rub+DdS/MBEzhUX87cuiyuDiyIhhBDyvBj49pK4Oh1L6fQb+OoUYqvrRDdiKACShNCZqSxM0YKFyP2wkFjy0H/VTbjAwtuGfPbXnOL4IUNK9bUzzWSrbQ/4Bx2D4J45lpg2AAAAAElFTkSuQmCC';

const setCountries = flagType => {
  //if (typeof flagType !== 'undefined') {
    //isEmojiable = flagType === FLAG_TYPES.emoji
  //}

  if (isEmojiable) {
    //countries = require('../data/countries-emoji')
    //Emoji = require('./emoji').default
  } else {
    countries = require('../data/countries')

    Emoji = <View />
  }
}

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

setCountries()

export const getAllCountries = () =>
  m49List.map(m49 => ({ ...countries[m49], m49 }))

export default class CountryPicker extends Component {
  static propTypes = {
    m49: PropTypes.string.isRequired,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    filterable: PropTypes.bool,
    children: PropTypes.node,
    countryList: PropTypes.array,
    excludeCountries: PropTypes.array,
    styles: PropTypes.object,
    filterPlaceholder: PropTypes.string,
    autoFocusFilter: PropTypes.bool,
    // to provide a functionality to disable/enable the onPress of Country Picker.
    disabled: PropTypes.bool,
    filterPlaceholderTextColor: PropTypes.string,
    closeButtonImage: PropTypes.element,
    transparent: PropTypes.bool,
    animationType: PropTypes.oneOf(['slide', 'fade', 'none']),
    flagType: PropTypes.oneOf(Object.values(FLAG_TYPES)),
    hideAlphabetFilter: PropTypes.bool,
    renderFilter: PropTypes.func,
    showCallingCode: PropTypes.bool,
    filterOptions: PropTypes.object
  }

  static defaultProps = {
    translation: 'en',
    countryList: m49List,
    excludeCountries: [],
    filterPlaceholder: 'Filter',
    autoFocusFilter: true,
    transparent: false,
    animationType: 'none'
  }

  static renderEmojiFlag(m49, emojiStyle) {
    return (
      <Text style={[styles.emojiFlag, emojiStyle]} allowFontScaling={false}>
        {m49 !== '' && countries[m49.toUpperCase()] ? (
          <Emoji name={countries[m49.toUpperCase()].flag} />
        ) : null}
      </Text>
    )
  }

  static renderImageFlag(m49, imageStyle) {
    if (m49 !== '') {
      let flag = countries[m49].flag;
      if (flag === '') {
        flag = NO_FLAG;
      }
      return (
        <Image
          style={[styles.imgStyle, imageStyle]}
          source={{ uri: flag }}
        />
      );
    }
    return null;
  }

  static renderFlag(m49, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={[styles.itemCountryFlag, itemStyle]}>
        {isEmojiable
          ? CountryPicker.renderEmojiFlag(m49, emojiStyle)
          : CountryPicker.renderImageFlag(m49, imageStyle)}
      </View>
    )
  }

  constructor(props) {
    super(props)
    this.openModal = this.openModal.bind(this)

    setCountries(props.flagType)
    let countryList = [...props.countryList]
    const excludeCountries = [...props.excludeCountries]

    excludeCountries.forEach(excludeCountry => {
      const index = countryList.indexOf(excludeCountry)

      if (index !== -1) {
        countryList.splice(index, 1)
      }
    })

    // Sort country list
    countryList = countryList
      .map(c => [c, this.getCountryName(countries[c])])
      .sort((a, b) => {
        if (a[1] < b[1]) return -1
        if (a[1] > b[1]) return 1
        return 0
      })
      .map(c => c[0])

    this.state = {
      modalVisible: false,
      m49List: countryList,
      dataSource: ds.cloneWithRows(countryList),
      filter: '',
      letters: this.getLetters(countryList)
    }

    if (this.props.styles) {
      Object.keys(countryPickerStyles).forEach(key => {
        styles[key] = StyleSheet.flatten([
          countryPickerStyles[key],
          this.props.styles[key]
        ])
      })
      styles = StyleSheet.create(styles)
    } else {
      styles = countryPickerStyles
    }

    const options = Object.assign({
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name'],
      id: 'id'
    }, this.props.filterOptions);
    this.fuse = new Fuse(
      countryList.reduce(
        (acc, item) => [
          ...acc,
          { id: item, name: this.getCountryName(countries[item]) }
        ],
        []
      ),
      options
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.countryList !== this.props.countryList) {
      this.setState({
        m49List: nextProps.countryList,
        dataSource: ds.cloneWithRows(nextProps.countryList)
      })
    }
  }

  onSelectCountry(m49) {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: ds.cloneWithRows(this.state.m49List)
    })

    this.props.onChange({
      m49,
      ...countries[m49],
      flag: undefined,
      name: this.getCountryName(countries[m49])
    })
  }

  onClose = () => {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: ds.cloneWithRows(this.state.m49List)
    })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  getCountryName(country, optionalTranslation) {
    const translation = optionalTranslation || this.props.translation || 'en'
    return country.name[translation] || country.name.common
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset
  }

  getLetters(list) {
    return Object.keys(
      list.reduce(
        (acc, val) => ({
          ...acc,
          [this.getCountryName(countries[val])
            .slice(0, 1)
            .toUpperCase()]: ''
        }),
        {}
      )
    ).sort()
  }

  m49ToName(m49, locale) {
    return countries[m49].name[locale];
  }

  openModal = this.openModal.bind(this)

  // dimensions of country list and window
  itemHeight = getHeightPercent(7)
  listHeight = countries.length * this.itemHeight

  openModal() {
    this.setState({ modalVisible: true })
  }

  scrollTo(letter) {
    // find position of first country that starts with letter
    const index = this.state.m49List
      .map(country => this.getCountryName(countries[country])[0])
      .indexOf(letter)
    if (index === -1) {
      return
    }
    let position = index * this.itemHeight

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight
    }

    // scroll
    this._listView.scrollTo({
      y: position
    })
  }

  handleFilterChange = value => {
    const filteredCountries =
      value === '' ? this.state.m49List : this.fuse.search(value)

    this._listView.scrollTo({ y: 0 })

    this.setState({
      filter: value,
      dataSource: ds.cloneWithRows(filteredCountries)
    })
  }

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectCountry(country)}
        activeOpacity={0.99}
      >
        {this.renderCountryDetail(country)}
      </TouchableOpacity>
    )
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.scrollTo(letter)}
        activeOpacity={0.6}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText} allowFontScaling={false}>
            {letter}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderCountryDetail(m49) {
    const country = countries[m49]
    return (
      <View style={styles.itemCountry}>
        {CountryPicker.renderFlag(m49)}
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName} allowFontScaling={false}>
            {this.getCountryName(country)}
            {this.props.showCallingCode &&
            country.callingCode &&
            <Text>{` (+${country.callingCode})`}</Text>}
          </Text>
        </View>
      </View>
    )
  }

  renderFilter = () => {
    const {
      renderFilter,
      autoFocusFilter,
      filterPlaceholder,
      filterPlaceholderTextColor
    } = this.props

    const value = this.state.filter
    const onChange = this.handleFilterChange
    const onClose = this.onClose

    return renderFilter ? (
      renderFilter({ value, onChange, onClose })
    ) : (
      <TextInput
        autoFocus={autoFocusFilter}
        autoCorrect={false}
        placeholder={filterPlaceholder}
        placeholderTextColor={filterPlaceholderTextColor}
        style={[styles.input, !this.props.closeable && styles.inputOnly]}
        onChangeText={onChange}
        value={value}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          {this.props.children ? (
            this.props.children
          ) : (
            <View
              style={[styles.touchFlag, { marginTop: isEmojiable ? 0 : 5 }]}
            >
              {CountryPicker.renderFlag(this.props.m49)}
            </View>
          )}
        </TouchableOpacity>
        <Modal
          transparent={this.props.transparent}
          animationType={this.props.animationType}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.header}>
              {this.props.closeable && (
                <CloseButton
                  image={this.props.closeButtonImage}
                  styles={[styles.closeButton, styles.closeButtonImage]}
                  onPress={() => this.onClose()}
                />
              )}
              {this.props.filterable && this.renderFilter()}
            </View>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.contentContainer}>
                <ListView
                  keyboardShouldPersistTaps="always"
                  enableEmptySections
                  ref={listView => (this._listView = listView)}
                  dataSource={this.state.dataSource}
                  renderRow={country => this.renderCountry(country)}
                  initialListSize={30}
                  pageSize={15}
                  onLayout={({ nativeEvent: { layout: { y: offset } } }) =>
                    this.setVisibleListHeight(offset)
                  }
                />
                {!this.props.hideAlphabetFilter && (
                  <ScrollView
                    contentContainerStyle={styles.letters}
                    keyboardShouldPersistTaps="always"
                  >
                    {this.state.filter === '' &&
                      this.state.letters.map((letter, index) =>
                        this.renderLetters(letter, index)
                      )}
                  </ScrollView>
                )}
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}
