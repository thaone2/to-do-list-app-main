// import AsyncStorage from '@react-native-async-storage/async-storage';
// import database from '@react-native-firebase/database';
// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ViewToken,
// } from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from 'react-native-reanimated';

// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// interface Warning {
//   computer: string;
//   temperature: number;
//   timestamp: string;
// }

// const NotificationScreen: React.FC = () => {
//   const [warnings, setWarnings] = useState<Warning[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const previousData = useRef<Record<string, number>>({});
//   const viewableItems = useSharedValue<ViewToken[]>([]);

//   const fetchWarnings = useCallback(async () => {
//     try {
//       const storedWarnings = await AsyncStorage.getItem('warnings');
//       if (storedWarnings) {
//         setWarnings(JSON.parse(storedWarnings));
//       }
//     } catch (error) {
//       console.error('Error fetching warnings from storage:', error);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     fetchWarnings();
//   }, [fetchWarnings]);

//   useEffect(() => {
//     const temperatureRef = database().ref('Temperatures');

//     const onTemperatureChange = temperatureRef.on('value', snapshot => {
//       const data = snapshot.val();

//       if (data) {
//         const newWarnings: Warning[] = [];
//         Object.entries(data).forEach(([key, value]) => {
//           const temp = value.temperature || 0;
//           if (temp > 40 && temp !== previousData.current[key]) {
//             newWarnings.push({
//               computer: key,
//               temperature: temp,
//               timestamp: new Date().toLocaleString(),
//             });
//           }
//           previousData.current[key] = temp;
//         });

//         if (newWarnings.length > 0) {
//           setWarnings(prevWarnings => {
//             const updatedWarnings = [...prevWarnings, ...newWarnings];
//             AsyncStorage.setItem('warnings', JSON.stringify(updatedWarnings));
//             return updatedWarnings;
//           });
//         }
//       }
//     });

//     return () => {
//       temperatureRef.off('value', onTemperatureChange);
//     };
//   }, []);

//   const handleDeleteWarning = (index: number) => {
//     setWarnings(prevWarnings => {
//       const updatedWarnings = prevWarnings.filter((_, i) => i !== index);
//       AsyncStorage.setItem('warnings', JSON.stringify(updatedWarnings));
//       return updatedWarnings;
//     });
//   };

//   const WarningItem: React.FC<{item: Warning; index: number}> = props => {
//     const {item, index} = props;

//     const rStyle = useAnimatedStyle(() => {
//       const isVisible = Boolean(
//         viewableItems.value
//           .filter(vItem => vItem.isViewable)
//           .find(vItem => vItem.index === index),
//       );

//       return {
//         opacity: withTiming(isVisible ? 1 : 0.4),
//         transform: [
//           {
//             scale: withTiming(isVisible ? 1 : 0.5),
//           },
//         ],
//       };
//     });

//     return (
//       <Animated.View style={[styles.warningContainer, rStyle]}>
//         <TextComponent
//           text={`⚠️ Cảnh báo !!!`}
//           color="yellow"
//           size={20}
//           styles={{fontWeight: 'bold', paddingLeft: 2}}
//         />
//         <TextComponent
//           text={`Nhiệt độ ${item.computer} hiện tại đang cao: ${item.temperature}°C🌡️`}
//           color="white"
//           size={18}
//           styles={{paddingHorizontal: 2}}
//         />
//         <Text style={styles.timestamp}>{item.timestamp}</Text>
//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={() => handleDeleteWarning(index)}>
//           <Text style={{color: 'white', fontSize: 16}}>❌</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   const onViewableItemsChanged = useCallback(
//     ({viewableItems: vItems}: {viewableItems: ViewToken[]}) => {
//       viewableItems.value = vItems;
//     },
//     [],
//   );

//   return (
//     <View style={{flex: 1, marginVertical: -8}}>
//       {loading ? (
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <ActivityIndicator color="blue" />
//           <TextComponent
//             color="black"
//             text="Đang tải dữ liệu..."
//             size={18}
//             styles={{textAlign: 'center', marginTop: 20}}
//           />
//         </View>
//       ) : warnings.length === 0 ? (
//         <View
//           style={[
//             globalStyles.inputContainer,
//             {
//               backgroundColor: '#54bed8',
//               marginHorizontal: 12,
//               borderRadius: 12,
//               // paddingVertical: 20,
//               justifyContent: 'center',
//               marginTop: 20,
//               // flex: 1,
//             },
//           ]}>
//           <TextComponent
//             color="white"
//             text="Hiện tại không có thông báo nào"
//             size={18}
//             styles={{flex: 0, textAlign: 'center'}}
//           />
//           <TextComponent
//             color="white"
//             text="Mọi đang bình thường "
//             size={18}
//             styles={{flex: 0, textAlign: 'center'}}
//           />
//         </View>
//       ) : (
//         <FlatList
//           data={warnings.slice().reverse()}
//           keyExtractor={(_, index) => index.toString()}
//           contentContainerStyle={{paddingVertical: 20}}
//           onViewableItemsChanged={onViewableItemsChanged}
//           renderItem={({item, index}) => (
//             <WarningItem item={item} index={index} />
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   warningContainer: {
//     marginHorizontal: 20,
//     marginVertical: 8,
//     // backgroundColor: 'rgba(255, 0, 0, 0.5)',
//     backgroundColor: '#CAC7C7',
//     borderRadius: 12,
//     paddingVertical: 8,
//     justifyContent: 'center',
//     padding: 2,
//     flex: 1,
//   },
//   timestamp: {
//     color: 'white',
//     fontSize: 12,
//     position: 'absolute',
//     bottom: 5,
//     right: 10,
//   },
//   deleteButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'transparent',
//   },
//   emptyContainer: {
//     backgroundColor: 'gray',
//     marginHorizontal: 8,
//     borderRadius: 12,
//     paddingVertical: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
// });

// export default NotificationScreen;

import Icon from 'react-native-vector-icons/AntDesign';
import IconCheck from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TextComponent from '../../components/TextComponent';

interface Warning {
  computer: string;
  temperature: number;
  timestamp: string;
}

const NotificationScreen: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const previousData = useRef<Record<string, number>>({});
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const onViewableItemsChangedRef = useRef<{
    callback: ({viewableItems: vItems}: {viewableItems: ViewToken[]}) => void;
  }>({
    callback: ({viewableItems: vItems}) => {
      viewableItems.value = vItems;
    },
  });

  const fetchWarnings = useCallback(async () => {
    try {
      const storedWarnings = await AsyncStorage.getItem('warnings');
      if (storedWarnings) {
        setWarnings(JSON.parse(storedWarnings));
      }
    } catch (error) {
      console.error('Error fetching warnings from storage:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  useEffect(() => {
    const temperatureRef = database().ref('Temperatures');
    const onTemperatureChange = temperatureRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const newWarnings: Warning[] = [];
        Object.entries(data).forEach(([key, value]) => {
          const temp = value.temperature || 0;
          if (temp > 40 && temp !== previousData.current[key]) {
            newWarnings.push({
              computer: key,
              temperature: temp,
              timestamp: new Date().toLocaleString(),
            });
          }
          previousData.current[key] = temp;
        });

        if (newWarnings.length > 0) {
          setWarnings(prevWarnings => {
            const updatedWarnings = [...prevWarnings, ...newWarnings];
            AsyncStorage.setItem('warnings', JSON.stringify(updatedWarnings));
            return updatedWarnings;
          });
        }
      }
    });

    return () => {
      temperatureRef.off('value', onTemperatureChange);
    };
  }, []);

  const handleDeleteWarning = (index: number) => {
    setWarnings(prevWarnings => {
      // Tính lại chỉ số thực trong mảng gốc
      const actualIndex = prevWarnings.length - 1 - index;
      // Xóa phần tử tại chỉ số thực
      const updatedWarnings = prevWarnings.filter((_, i) => i !== actualIndex);
      // Lưu lại danh sách mới vào AsyncStorage
      AsyncStorage.setItem('warnings', JSON.stringify(updatedWarnings));
      return updatedWarnings;
    });
  };

  const handleDeleteAllWaring = () => {
    setWarnings([]);
    AsyncStorage.setItem('warnings', JSON.stringify([]));
    return setWarnings;
  };

  const WarningItem: React.FC<{item: Warning; index: number}> = props => {
    const {item, index} = props;

    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter(vItem => vItem.isViewable)
          .find(vItem => vItem.index === index),
      );

      return {
        opacity: withTiming(isVisible ? 1 : 0.2),
        transform: [
          {
            scale: withTiming(isVisible ? 1 : 0.5),
          },
        ],
      };
    });

    return (
      <Animated.View style={[styles.warningContainer, rStyle]}>
        <TextComponent
          text={`⚠️ Cảnh báo !!!`}
          color="black"
          size={18}
          styles={{fontWeight: 'bold', paddingLeft: 4, paddingVertical: 6}}
        />
        <TextComponent
          text={`Nhiệt độ ${item.computer} hiện tại đang cao: ${item.temperature}°C`}
          color="black"
          size={14}
          styles={{paddingHorizontal: 8, paddingBottom: 20}}
        />
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteWarning(index)}>
          <Icon name="closecircleo" size={22} color="#D20103" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{flex: 1, marginVertical: -8}}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50%',
          }}>
          <ActivityIndicator color="black" size="large" />
          <TextComponent
            color="black"
            text="Đang tải dữ liệu..."
            size={17}
            styles={{textAlign: 'center', marginTop: 10}}
          />
        </View>
      ) : warnings.length === 0 ? (
        <View
          style={[
            styles.emptyContainer,
            {marginTop: 20, marginHorizontal: 12},
          ]}>
          <TextComponent
            color="black"
            text="Hiện tại không có thông báo nào"
            size={16}
            styles={{textAlign: 'center', flex: 0}}
          />
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={{
              marginTop: 20,
              top: -50,
              right: 20,
              position: 'absolute',
              zIndex: 1,
            }}
            onPress={() => {
              handleDeleteAllWaring();
            }}>
            <TextComponent
              text="☑ Đọc tất cả"
              color="gray"
              size={16}
              styles={{
                textAlign: 'right',
                paddingHorizontal: 4,
              }}
            />
          </TouchableOpacity>

          <FlatList
            data={warnings.slice().reverse()}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{paddingVertical: 20}}
            onViewableItemsChanged={onViewableItemsChangedRef.current.callback}
            renderItem={({item, index}) => (
              <WarningItem item={item} index={index} />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  warningContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#CAC7C7',
    borderRadius: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    padding: 2,
    flex: 1,
  },
  timestamp: {
    color: 'gray',
    fontSize: 12,
    position: 'absolute',
    bottom: 5,
    right: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    backgroundColor: '#CAC7C7',
    marginHorizontal: 8,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
});

export default NotificationScreen;
