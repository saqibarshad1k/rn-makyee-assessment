import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {hp, wp} from '../theme/dimensions';
import FastImage from 'react-native-fast-image';

export default function EmployeesDetail({route}) {
  const data = route.params.item;

  const Separator = () => (
    <View
      style={{
        backgroundColor: '#000',
        height: hp(0.1),
        width: wp(90),
        alignSelf: 'center',
      }}></View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        style={styles.linearGradient}
        colors={['#E1F5FE', '#FCE4EC', '#E1F5FE']}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: hp(2),
          }}>
          <Text style={styles.head}>Employee Details</Text>
        </View>
        <View style={styles.imageContainer}>
          <FastImage
            style={styles.image}
            source={{
              uri:
                data?.profile_image ||
                `https://ui-avatars.com/api/?name=${data.employee_name}`,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={styles.emList}>
          <Text style={styles.head}>Employee's ID</Text>
          <Text>{data?.id}</Text>
        </View>
        <Separator></Separator>
        <View style={styles.emList}>
          <Text style={styles.head}>Employee's Name</Text>
          <Text>{data?.employee_name}</Text>
        </View>
        <Separator></Separator>
        <View style={styles.emList}>
          <Text style={styles.head}>Employee's Age</Text>
          <Text>{data?.employee_age}</Text>
        </View>
        <Separator></Separator>
        <View style={styles.emList}>
          <Text style={styles.head}>Employee's Salary</Text>
          <Text>{data?.employee_salary}</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linearGradient: {
    height: hp(100),
  },
  imageContainer: {
    width: wp(100),
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderColor: '#B0BEC5',
    borderWidth: hp(0.3),
    width: wp(50),
    height: wp(50),
    borderRadius: wp(45),
  },
  emList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(10),
    paddingBottom: hp(2),
    paddingTop: hp(2),
  },
  head: {
    fontWeight: 'bold',
    color: '#000',
  },
});
