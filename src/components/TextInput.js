import {View, TextInput} from 'react-native';
import React from 'react';
import {hp, wp} from '../theme/dimensions';

export default function CustomTextInput({
  width = wp(95),
  placeholder,
  onChangeText,
  value,
  type,
}) {
  return (
    <View
      style={{
        borderWidth: wp(0.2),
        borderColor: '#01579B',
        backgroundColor: '#fff',
        width: width,
        alignSelf: 'center',
        borderRadius: hp(2),
        overflow: 'hidden',
        paddingHorizontal: wp(5),
      }}>
      <TextInput
        keyboardType={type}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          fontSize: hp(2),
          fontWeight: '400',
          height: hp(6),
        }}></TextInput>
    </View>
  );
}
