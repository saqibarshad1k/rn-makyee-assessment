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
import {deleteRequest, getRequest, postRequest, putRequest} from '../api/index';
import FastImage from 'react-native-fast-image';
import {hp, wp} from '../theme/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import TextInput from '../components/TextInput';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {endpoints} from '../api/endpoints';

const EmployeesListing = () => {
  const navigation = useNavigation();

  const [apidata, setData] = useState([]);

  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [salary, setSalary] = useState(null);

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [filterModal, setFilterModal] = useState(false);
  const [addEmployeeModal, setAddEmployeeModal] = useState(false);
  const [updateEmployeeModal, setUpdateEmployeeModal] = useState(false);
  const [employeeOptionModal, setEmployeeOptionModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState({});

  const [filterType, setFilterType] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (addEmployeeModal === false) {
      setName(null);
      setSalary(null);
      setAge(null);
    }
  }, [addEmployeeModal]);

  const handleTransit = () => {
    setSalary(selectedEmployee?.employee_salary.toString());
    setName(selectedEmployee?.employee_name);
    setAge(selectedEmployee?.employee_age.toString());
    setUpdateEmployeeModal(true);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const data = await getRequest(endpoints?.getEmployees).finally(() => {
        setLoading(false);
      });

      setData(data?.data?.data);
      setFilteredData(data?.data?.data);
    } catch (e) {
      console.log(e);
      alert('Error fetching employees data.');
    }
  };

  const submitData = async () => {
    if (!name || !age || !salary) {
      alert('Please fill all the fields');
    } else {
      setSubmitLoading(true);
      try {
        const data = await postRequest(endpoints?.createEmployee, {
          name,
          age,
          salary,
        }).finally(() => {
          setSubmitLoading(false);
        });

        setData([
          {
            id: data?.data?.data?.id,
            employee_name: data?.data?.data?.name,
            employee_age: data?.data?.data?.age,
            employee_salary: data?.data?.data?.salary,
          },
          ...apidata,
        ]);
        setFilteredData([
          {
            id: data?.data?.data?.id,
            employee_name: data?.data?.data?.name,
            employee_age: data?.data?.data?.age,
            employee_salary: data?.data?.data?.salary,
          },
          ...apidata,
        ]);

        setAddEmployeeModal(false);

        alert('New employee has been added successfully.');
      } catch (e) {
        console.log(e);
        setSubmitLoading(false);
        alert('Error posting data to server.');
      }
    }
  };
  const updateData = async () => {
    if (!name || !age || !salary) {
      alert('Please fill all the fields');
    } else {
      setSubmitLoading(true);
      try {
        const data = await putRequest(
          `${endpoints?.updateEmployee}/${selectedEmployee?.id}`,
          {
            name,
            age,
            salary,
          },
        ).finally(() => {
          setSubmitLoading(false);
        });

        const updatedEmployee = {
          id: data?.data?.data?.id,
          employee_name: data?.data?.data?.name,
          employee_age: data?.data?.data?.age,
          employee_salary: data?.data?.data?.salary,
        };

        const updatedApidata = apidata.map(item =>
          item.id === selectedEmployee.id ? updatedEmployee : item,
        );

        const updatedFilteredData = filteredData.map(item =>
          item.id === selectedEmployee.id ? updatedEmployee : item,
        );

        setData(updatedApidata);
        setFilteredData(updatedFilteredData);

        setUpdateEmployeeModal(false);

        alert('Employee has been updated successfully.');
      } catch (e) {
        console.log(e);
        setSubmitLoading(false);
        alert('Error updating data to server.');
      }
    }

    setUpdateEmployeeModal(false);
  };

  const deleteData = async () => {
    setSubmitLoading(true);
    try {
      await deleteRequest(
        `${endpoints?.deleteEmployee}/${selectedEmployee?.id}`,
      ).finally(() => {
        setSubmitLoading(false);
      });

      const updatedApidata = apidata.filter(
        item => item.id !== selectedEmployee.id,
      );
      const updatedFilteredData = filteredData.filter(
        item => item.id !== selectedEmployee.id,
      );

      setData(updatedApidata);
      setFilteredData(updatedFilteredData);

      setEmployeeOptionModal(false);

      alert('Employee has been deleted successfully.');
    } catch (e) {
      console.log(e);
      setSubmitLoading(false);
      alert('Error deleting data from server.');
    }
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
    let filtered = apidata;
    if (query) {
      switch (filterType) {
        case 'name':
          filtered = apidata.filter(item =>
            item.employee_name.toLowerCase().includes(query.toLowerCase()),
          );
          break;
        case 'age':
          filtered = apidata.filter(item =>
            item.employee_age.toString().includes(query),
          );
          break;
        case 'salary':
          filtered = apidata.filter(item =>
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
      <TouchableOpacity
        onPress={() => {
          setEmployeeOptionModal(true);
          setSelectedEmployee(item);
        }}
        style={{
          padding: hp(0.5),
        }}>
        <Entypo name="dots-three-vertical" size={20} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" /> */}
      <LinearGradient
        style={styles.linearGradient}
        colors={['#E1F5FE', '#FCE4EC', '#E1F5FE']}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp(2),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.headerText}>Employees</Text>
            <TouchableOpacity
              onPress={() => setAddEmployeeModal(true)}
              style={{
                padding: hp(0.5),
              }}>
              <Entypo size={18} color={'#000'} name="add-user"></Entypo>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setFilterModal(true)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: wp(3),
            }}>
            <Ionicons name="filter" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder={`Search by ${filterType}`}
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {apidata.length < 1 ? (
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
                  marginTop: hp(1),
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
        isVisible={updateEmployeeModal}
        swipeDirection={['down', 'up']}
        propagateSwipe={true}
        useNativeDriver={true}
        onBackdropPress={() => setUpdateEmployeeModal(false)}
        onSwipeComplete={() => setUpdateEmployeeModal(false)}
        panResponderThreshold={0}
        style={
          {
            // overflow: 'hidden',
            // alignSelf: 'center',
            // backgroundColor: '#fff',
            // width: wp(90),
            // borderRadius: hp(3),
            // height: hp(50),
          }
        }>
        <View>
          <View
            style={{
              height: hp(30),
              justifyContent: 'space-evenly',
            }}>
            <TextInput
              type={'alpha-numeric'}
              value={name}
              onChangeText={text => setName(text)}
              placeholder={`Employee's Name`}
              width={'90%'}></TextInput>
            <TextInput
              type={'numeric'}
              value={age}
              onChangeText={text => setAge(text)}
              placeholder={`Employee's Age`}
              width={'90%'}></TextInput>
            <TextInput
              type={'numeric'}
              value={salary}
              onChangeText={text => setSalary(text)}
              placeholder={`Employee's Salary`}
              width={'90%'}></TextInput>
            <TouchableOpacity
              onPress={() => updateData()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#01579B',
                paddingVertical: hp(2),
                width: '90%',
                alignSelf: 'center',
                borderRadius: hp(2),
              }}>
              {submitLoading ? (
                <ActivityIndicator color={'#fff'}></ActivityIndicator>
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: hp(2),
                    fontWeight: 'bold',
                  }}>
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationIn={'slideInUp'}
        animationInTiming={100}
        animationOutTiming={100}
        animationOut={'slideOutDown'}
        isVisible={addEmployeeModal}
        swipeDirection={['down', 'up']}
        propagateSwipe={true}
        useNativeDriver={true}
        onBackdropPress={() => setAddEmployeeModal(false)}
        onSwipeComplete={() => setAddEmployeeModal(false)}
        panResponderThreshold={0}
        style={
          {
            // overflow: 'hidden',
            // alignSelf: 'center',
            // backgroundColor: '#fff',
            // width: wp(90),
            // borderRadius: hp(3),
            // height: hp(50),
          }
        }>
        <View>
          <View
            style={{
              height: hp(30),
              justifyContent: 'space-evenly',
            }}>
            <TextInput
              type={'alpha-numeric'}
              value={name}
              onChangeText={text => setName(text)}
              placeholder={`Employee's Name`}
              width={'90%'}></TextInput>
            <TextInput
              type={'numeric'}
              value={age}
              onChangeText={text => setAge(text)}
              placeholder={`Employee's Age`}
              width={'90%'}></TextInput>
            <TextInput
              type={'numeric'}
              value={salary}
              onChangeText={text => setSalary(text)}
              placeholder={`Employee's Salary`}
              width={'90%'}></TextInput>
            <TouchableOpacity
              onPress={() => submitData()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#01579B',
                paddingVertical: hp(2),
                width: '90%',
                alignSelf: 'center',
                borderRadius: hp(2),
              }}>
              {submitLoading ? (
                <ActivityIndicator color={'#fff'}></ActivityIndicator>
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: hp(2),
                    fontWeight: 'bold',
                  }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
      <Modal
        animationIn={'slideInUp'}
        animationInTiming={100}
        animationOutTiming={100}
        animationOut={'slideOutDown'}
        isVisible={employeeOptionModal}
        swipeDirection={['down', 'up']}
        propagateSwipe={true}
        useNativeDriver={true}
        onBackdropPress={() => setEmployeeOptionModal(false)}
        onSwipeComplete={() => setEmployeeOptionModal(false)}
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
              {`Edit ${selectedEmployee?.employee_name}`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEmployeeOptionModal(false);
              handleTransit();
            }}
            style={[
              styles.filterOptions,
              {
                backgroundColor: '#E1F5FE',
              },
            ]}>
            <Text
              style={[
                styles.filterOptionsLabel,
                {
                  fontWeight: 'bold',
                  color: '#01579B',
                },
              ]}>
              Update
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteData()}
            style={[
              styles.filterOptions,
              {
                backgroundColor: '#FCE4EC',
              },
            ]}>
            {submitLoading ? (
              <ActivityIndicator
                size={'small'}
                color={'#000'}></ActivityIndicator>
            ) : (
              <Text
                style={[
                  styles.filterOptionsLabel,
                  {
                    fontWeight: 'bold',
                    color: '#D81B60',
                  },
                ]}>
                Delete
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterOptions: {
    width: wp(90),
    borderRadius: hp(1),
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
  },
  list: {
    paddingBottom: hp(10),
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
