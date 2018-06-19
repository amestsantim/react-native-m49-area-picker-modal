import React from 'react'
// import 'react-native'

import renderer from 'react-test-renderer'

import CountryPicker from '../src/CountryPicker'

it('CountryPicker can be created', () => {
  const picker = renderer.create(
    <CountryPicker cca2={'231'} onChange={() => {}} />
  )
  expect(picker).toBeDefined()
})
