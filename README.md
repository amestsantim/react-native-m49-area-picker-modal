# react-native-m49-area-picker-modal

The area picker for apps that need to use the UN defined areas (https://en.wikipedia.org/wiki/UN_M.49) in their apps.
This components was created by forking https://github.com/xcarpentier/react-native-country-picker-modal but has since been modified a bit.

## Installation
```bash
$ yarn add react-native-m49-area-picker-modal
```
## Basic Usage
- Install `react-native` first

```bash
$ npm i react-native -g
```

- Initialization of a react-native project

```bash
$ react-native init myproject
```

- Then, edit `myproject/index.ios.js`, like this:

```jsx
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CountryPicker from 'react-native-un-code-area-picker-modal';

class Example extends Component {
  constructor(props){
    super(props);
    this.state = {
      m49,
      country
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to UN code area picker !
        </Text>
        <CountryPicker
          onChange={(value)=> {
            this.setState({m49: value.m49, country: value.name});
          }}
          m49={this.state.m49}
          translation='en'
        />
        <Text style={styles.instructions}>
          press on the flag
        </Text>
        {this.state.country &&
          <Text style={styles.data}>
            {JSON.stringify(this.state.country, null, 2)}
          </Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
  },
  data: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#ddd',
    borderColor: '#888',
    borderWidth: 1 / PixelRatio.get(),
    color: '#777'
  }
});

AppRegistry.registerComponent('example', () => Example);
```

## Props

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| m49 | string | \*required | M.49 area codes (ie. 001, 213, etc.)|
| translation | string | 'en' | The language display for the name of the country (en, fr) |
| onChange | function | \*required | The handler when a country is selected |
| onClose | function | \*required | The handler when the close button is clicked |
| countryList | array | See [m49.json](https://github.com/amestsantim/react-native-un-code-area-picker-modal/blob/master/data/m49.json)| List of custom M49 areas to render in the list. |
| excludeCountries | array | [] | List of custom M49 areas you don't want to render |
| closeable | bool | false | If true, the CountryPicker will have a close button |
| filterable | bool | false | If true, the CountryPicker will have search bar |
| filterPlaceholder | string | 'Filter' | The search bar placeholder text |
| autoFocusFilter | bool | true | Whether or not the search bar should be autofocused |
| styles | object | {} | Override any style specified in the component (see source code)|
| disabled | bool | false | Whether or not the Country Picker onPress is disabled

## Dependencies
- world-countries : https://www.npmjs.com/package/world-countries

## FAQ
### Is it supported and tested both on android and iOS?
YES
### Is the data that is populated inside the list saved offline once I install your package?
YES : It used the world-countries package and image is stored into json and base64.

## Apps using this component
SDG app found in Google Play and Apple App Store

## Questions

Feel free to [contact me](mailto:nahomt@amestsantim.com) or [create an issue](https://github.com/amestsantim/react-native-un-code-area-picker-modal/issues/new)

## Licence
[MIT](https://github.com/amestsantim/react-native-un-code-area-picker-modal/blob/master/LICENSE.md)
