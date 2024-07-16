import {View, TextInput} from 'react-native';
import React from 'react';
import {hp, wp} from '../theme/dimensions';

export default function CustomTextInput({placeholder, onChangeText, value}) {
  return (
    <View
      style={{
        borderWidth: wp(0.2),
        borderColor: '#01579B',
        backgroundColor: '#fff',
        width: wp(95),
        alignSelf: 'center',
        borderRadius: hp(2),
        overflow: 'hidden',
        paddingHorizontal: wp(5),
      }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          fontSize: hp(2),
          fontWeight: '400',
        }}></TextInput>
    </View>
  );
}
