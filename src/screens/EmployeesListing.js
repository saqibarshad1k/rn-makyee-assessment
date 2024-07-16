import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {getRequest} from '../api/index';
import FastImage from 'react-native-fast-image';
import {hp, wp} from '../theme/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import TextInput from '../components/TextInput';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';

const EmployeesListing = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [filterType, setFilterType] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const data = await getRequest('/employees').finally(() => {
      setLoading(false);
    });

    setData(data?.data?.data);
    setFilteredData(data?.data?.data);
  };

  const handleFilter = type => {
    setFilterType(type);
    setFilterModal(false);
  };

  const handleSearch = query => {
    setSearchQuery(query);
    filterData(query);
  };

  const filterData = query => {
    let filtered = data;
    if (query) {
      switch (filterType) {
        case 'name':
          filtered = data.filter(item =>
            item.employee_name.toLowerCase().includes(query.toLowerCase()),
          );
          break;
        case 'age':
          filtered = data.filter(item =>
            item.employee_age.toString().includes(query),
          );
          break;
        case 'salary':
          filtered = data.filter(item =>
            item.employee_salary.toString().includes(query),
          );
          break;
        default:
          break;
      }
    }
    setFilteredData(filtered);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('EmployeesDetail', {
          item,
        })
      }
      activeOpacity={0.7}
      style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.image}
          source={{
            uri:
              item?.profile_image ||
              `https://ui-avatars.com/api/?name=${item.employee_name}`,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.employee_name}</Text>
          <View
            style={[
              styles.ageContainer,
              {
                backgroundColor:
                  item.employee_age < 30
                    ? '#E8F5E9'
                    : item.employee_age < 40
                    ? '#EDE7F6'
                    : '#FCE4EC',
              },
            ]}>
            <Text
              style={[
                styles.ageText,
                {
                  color:
                    item.employee_age < 30
                      ? '#1B5E20'
                      : item.employee_age < 40
                      ? '#311B92'
                      : '#880E4F',
                },
              ]}>
              {`Age ${item.employee_age}`}
            </Text>
          </View>
        </View>
        <View style={styles.salaryContainer}>
          <Text style={styles.salary}>{'Salary'}</Text>
          <Text style={styles.salaryVal}>{` ${item.employee_salary}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        style={styles.linearGradient}
        colors={['#E1F5FE', '#FCE4EC', '#E1F5FE']}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.headerText}>Employees</Text>
          <TouchableOpacity
            onPress={() => setFilterModal(true)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: wp(3),
            }}>
            <Text
              style={{
                fontSize: hp(1.5),
                fontWeight: 'bold',
                color: '#01579B',
                backgroundColor: '#ECEFF1',
                padding: hp(1),
                borderRadius: hp(2),
              }}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder={`Search by ${filterType}`}
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {data.length < 1 ? (
          loading ? (
            <View
              style={{
                height: '70%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator
                size={'large'}
                color={'#000'}></ActivityIndicator>
            </View>
          ) : (
            <View
              style={{
                height: '70%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.headerText}>No data to show</Text>
              <TouchableOpacity
                onPress={() => getData()}
                style={{
                  backgroundColor: '#E1F5FE',
                  padding: hp(1.5),
                  borderRadius: hp(1),
                }}>
                <Text
                  style={{
                    color: '#01579B',
                    fontWeight: 'bold',
                  }}>
                  Reload
                </Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <FlatList
            style={{
              marginTop: hp(3),
            }}
            data={filteredData}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={getData} />
            }
          />
        )}
      </LinearGradient>
      <Modal
        animationIn={'slideInUp'}
        animationInTiming={100}
        animationOutTiming={100}
        animationOut={'slideOutDown'}
        isVisible={filterModal}
        swipeDirection={['down', 'up']}
        propagateSwipe={true}
        useNativeDriver={true}
        onBackdropPress={() => setFilterModal(false)}
        onSwipeComplete={() => setFilterModal(false)}
        panResponderThreshold={0}
        style={{
          overflow: 'hidden',
          borderRadiusTopRight: hp(5),
          bottom: -20,
          position: 'absolute',
          height: hp(30),
          backgroundColor: '#fff',
          width: wp(100),
          alignSelf: 'center',
          borderTopRightRadius: hp(3),
          borderTopLeftRadius: hp(3),
        }}>
        <View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: hp(2),
            }}>
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
              }}>
              Choose Filter
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleFilter('name')}
            style={[
              styles.filterOptions,
              {
                backgroundColor: filterType === 'name' ? '#E1F5FE' : '#fff',
              },
            ]}>
            <Text style={styles.filterOptionsLabel}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFilter('age')}
            style={[
              styles.filterOptions,
              {
                backgroundColor: filterType === 'age' ? '#E1F5FE' : '#fff',
              },
            ]}>
            <Text style={styles.filterOptionsLabel}>Age</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFilter('salary')}
            style={[
              styles.filterOptions,
              {
                backgroundColor: filterType === 'salary' ? '#E1F5FE' : '#fff',
              },
            ]}>
            <Text style={styles.filterOptionsLabel}>Salary</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterOptions: {
    width: wp(90),
    borderRadius: hp(3),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1.45),
  },
  filterOptionsLabel: {
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linearGradient: {
    height: hp(100),
  },
  headerText: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    paddingHorizontal: wp(3),
    color: '#000',
    marginTop: hp(3),
    paddingBottom: hp(2),
  },
  list: {
    padding: hp(1),
  },
  itemContainer: {
    backgroundColor: '#FAFAFA',
    padding: 16,
    marginBottom: 16,
    borderRadius: wp(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: wp(5),
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#000',
  },
  ageContainer: {
    marginLeft: wp(2),
    padding: wp(1),
    borderRadius: wp(2),
  },
  ageText: {
    fontSize: wp(2.5),
    fontWeight: 'bold',
  },
  salaryContainer: {
    alignSelf: 'flex-start',
    height: hp(3),
    backgroundColor: '#E1F5FE',
    flexDirection: 'row',
    borderRadius: wp(1),
    paddingHorizontal: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
  },
  salary: {
    fontSize: hp(1.5),
    fontWeight: 'bold',
    color: '#0288D1',
  },
  salaryVal: {
    fontSize: hp(1.5),
    color: '#0288D1',
  },
});

export default EmployeesListing;
