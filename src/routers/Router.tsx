import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import HomeScreen from '../screens/homes/HomeScreen';
import AddNewTask from '../screens/tasks/AddNewTask';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../auth/LoginScreen';
import auth from '@react-native-firebase/auth';
import RegisterScreen from '../auth/RegisterScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import ChartScreen from '../screens/chart/ChartScreen';
import SettingScreen from '../screens/setting/SettingScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ChartSquare,
  Home,
  Home2,
  Notification1,
  Setting3,
} from 'iconsax-react-native';
import {colors} from '../constants/colors';

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const MainNavigator = (
    // <Stack.Navigator
    //   screenOptions={{
    //     headerShown: false,
    //   }}>
    //   <Stack.Screen name="HomeScreen" component={HomeScreen} />
    //   <Stack.Screen name="AddNewTask" component={AddNewTask} />
    //   <Stack.Screen name="SearchScreen" component={SearchScreen} />
    //   <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    //   <Stack.Screen name="ChartScreen" component={ChartScreen} />
    //   <Stack.Screen name="SettingScreen" component={SettingScreen} />
    // </Stack.Navigator>

    // code gpt
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? (
              <Home2 size={38} color="green" variant="Bold" />
            ) : (
              <Home2 size={32} color={color} />
            );
          } else if (route.name === 'Chart') {
            iconName = focused ? (
              <ChartSquare size={38} color="coral" variant="Bold" />
            ) : (
              <ChartSquare size={32} color={color} />
            );
          } else if (route.name === 'Notification') {
            iconName = focused ? (
              <Notification1 size={38} color="orange" variant="Bold" />
            ) : (
              <Notification1 size={32} color={color} />
            );
          } else if (route.name === 'Setting') {
            iconName = focused ? (
              <Setting3 size={38} color="black" variant="Bold" />
            ) : (
              <Setting3 size={32} color={color} />
            );
          }
          return iconName;
        },
        // tabBarActiveTintColor: 'green', // Màu cho tab được chọn
        tabBarInactiveTintColor: 'gray', // Màu cho tab không được chọn
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerStyle: {
            backgroundColor: colors.bgColor,
          },
          headerTitleStyle: {
            fontSize: 28,
          },
          tabBarActiveTintColor: 'green',
        }}
      />
      <Tab.Screen
        name="Chart"
        component={ChartScreen}
        options={{
          tabBarLabel: 'Chart',
          headerStyle: {
            backgroundColor: colors.bgColor,
          },
          headerTitleStyle: {
            fontSize: 28,
          },
          tabBarActiveTintColor: 'coral',
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Notification',
          headerStyle: {
            backgroundColor: colors.bgColor,
          },
          headerTitleStyle: {
            fontSize: 28,
          },
          tabBarActiveTintColor: 'orange',
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarLabel: 'Setting',
          headerStyle: {
            backgroundColor: colors.bgColor,
          },
          headerTitleStyle: {
            fontSize: 28,
          },
          tabBarActiveTintColor: 'black',
        }}
      />
    </Tab.Navigator>
  );
  const AuthNavigator = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);

  return isLogin ? MainNavigator : AuthNavigator;
};

export default Router;
