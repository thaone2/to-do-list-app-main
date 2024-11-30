import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ChartSquare,
  CpuSetting,
  Home2,
  Notification1,
  Setting3,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import {colors} from '../constants/colors';
import ChartScreen from '../screens/chart/ChartScreen';
import HomeScreen from '../screens/homes/HomeScreen';
import MachineLearningScreen from '../screens/machineLearning/MachineLearningScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import SettingScreen from '../screens/setting/SettingScreen';

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [tabBarHeight, setTabBarHeight] = useState(80); // Dùng state để quản lý tabBarHeight

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    // Lắng nghe khi bàn phím mở
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTabBarHeight(0); // Ẩn tab bar khi bàn phím mở
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTabBarHeight(80); // Hiện tab bar khi bàn phím đóng
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const MainNavigator = (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarStyle: {
            height: tabBarHeight,
            // height: 70,
            paddingBottom: tabBarHeight > 0 ? 10 : 0,
            paddingTop: tabBarHeight > 0 ? 10 : 0,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
          tabBarIcon: ({focused, color}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? (
                <Home2 size={40} color="green" variant="Bold" />
              ) : (
                <Home2 size={32} color={color} />
              );
            } else if (route.name === 'Chart') {
              iconName = focused ? (
                <ChartSquare size={40} color="coral" variant="Bold" />
              ) : (
                <ChartSquare size={32} color={color} />
              );
            } else if (route.name === 'Notification') {
              iconName = focused ? (
                <Notification1 size={40} color="orange" variant="Bold" />
              ) : (
                <Notification1 size={32} color={color} />
              );
            } else if (route.name === 'MachineLearning') {
              iconName = focused ? (
                <CpuSetting size={40} color="#2ccce4" variant="Bold" />
              ) : (
                <CpuSetting size={32} color={color} />
              );
            } else if (route.name === 'Setting') {
              iconName = focused ? (
                <Setting3 size={40} color="black" variant="Bold" />
              ) : (
                <Setting3 size={32} color={color} />
              );
            }
            return iconName;
          },
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
              fontSize: 20,
            },
            tabBarActiveTintColor: 'green',
            title: 'LAB PC MANAGEMENT',
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
              fontSize: 20,
            },
            tabBarActiveTintColor: 'coral',
            title: 'BIỂU ĐỒ LƯỢNG ĐIỆN',
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
              fontSize: 20,
            },
            tabBarActiveTintColor: 'orange',
            title: 'THÔNG BÁO',
          }}
        />
        <Tab.Screen
          name="MachineLearning"
          component={MachineLearningScreen}
          options={{
            tabBarLabel: 'ML',
            headerStyle: {
              backgroundColor: colors.bgColor,
            },
            headerTitleStyle: {
              fontSize: 20,
            },
            tabBarActiveTintColor: '#2ccce4',
            title: 'MACHINE LEARNING',
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
              fontSize: 20,
            },
            tabBarActiveTintColor: 'black',
            title: 'SETTING',
          }}
        />
      </Tab.Navigator>
    </KeyboardAvoidingView>
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
