import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import EmployeesListing from '../screens/EmployeesListing';
import EmployeesDetail from '../screens/EmployeesDetail';
const Stack = createStackNavigator();

const AppNavigator = () => {
  const forFade = ({current}) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: forFade,
      }}
      initialRouteName="EmployeesListing">
      <Stack.Screen name="EmployeesListing" component={EmployeesListing} />
      <Stack.Screen name="EmployeesDetail" component={EmployeesDetail} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
