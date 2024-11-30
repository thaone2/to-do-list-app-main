// import React from 'react';
// import {View} from 'react-native';
// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const NotificationScreen = () => {
//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         <TextComponent
//           styles={[
//             globalStyles.inputContainer,
//             {
//               backgroundColor: 'white',
//               marginHorizontal: 20,
//             },
//           ]}
//           color="black"
//           text="Hiện tại đang không có thông báo nào 😴🥶"
//           size={16}
//         />
//         <View
//           style={[
//             globalStyles.inputContainer,
//             {marginHorizontal: 20, marginVertical: 8, backgroundColor: 'red'},
//           ]}>
//           <TextComponent
//             text="Nhiệt độ Máy tính 1 hiện tại đang cao"
//             color="red"
//             size={16}
//           />
//         </View>
//       </Container>
//     </View>
//   );
// };

// export default NotificationScreen;

// import React, {useState, useEffect, useRef} from 'react';
// import {View} from 'react-native';
// import database from '@react-native-firebase/database';
// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';
// import {colors} from '../../constants/colors';

// const NotificationScreen = () => {
//   const [warnings, setWarnings] = useState([]); // Lưu danh sách cảnh báo
//   const computerTemps = useRef({
//     computer1: 0,
//     computer2: 0,
//     computer3: 0,
//     computer4: 0,
//   });

//   useEffect(() => {
//     const temperatureRef = database().ref('Temperatures');

//     const onTemperatureChange = temperatureRef.on('value', snapshot => {
//       const data = snapshot.val();

//       if (data) {
//         // Cập nhật nhiệt độ các máy tính
//         computerTemps.current = {
//           computer1: data.computer1.temperature || 0,
//           computer2: data.computer2.temperature || 0,
//           computer3: data.computer3.temperature || 0,
//           computer4: data.computer4.temperature || 0,
//         };

//         // Kiểm tra nếu nhiệt độ vượt ngưỡng
//         const newWarnings:
//           | ((prevState: never[]) => never[])
//           | {computer: string; temperature: number}[] = [];
//         Object.entries(computerTemps.current).forEach(([key, temp]) => {
//           if (temp > 40) {
//             newWarnings.push({computer: key, temperature: temp});
//           }
//         });

//         // Cập nhật danh sách cảnh báo
//         setWarnings(newWarnings);
//       }
//     });

//     // Cleanup listener khi component bị unmount
//     return () => {
//       temperatureRef.off('value', onTemperatureChange);
//     };
//   }, []);

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         {warnings.length === 0 ? (
//           // Hiển thị khi không có cảnh báo
//           <View
//             style={[
//               globalStyles.inputContainer,
//               {
//                 backgroundColor: 'gray',
//                 marginHorizontal: 20,
//                 borderRadius: 12,
//                 paddingVertical: 20,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flex: 1,
//               },
//             ]}>
//             <TextComponent
//               color="white"
//               text="Hiện tại đang không có thông báo nào"
//               size={18}
//             />
//             <TextComponent
//               color="white"
//               text="Mọi thứ có vẻ đang bình thường"
//               size={18}
//             />
//           </View>
//         ) : (
//           // Hiển thị các cảnh báo
//           warnings.map((warning, index) => (
//             <View
//               key={index}
//               style={[
//                 globalStyles.inputContainer,
//                 {
//                   marginHorizontal: 20,
//                   marginVertical: 8,
//                   backgroundColor: '#FF7777',
//                   borderRadius: 18,
//                   paddingVertical: 4,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flex: 1,
//                 },
//               ]}>
//               <TextComponent
//                 text={`⚠️ Cảnh báo ⚠️ `}
//                 color="yellow"
//                 size={20}
//                 styles={{fontWeight: 'bold'}}
//               />
//               <TextComponent
//                 text={`Nhiệt độ ${warning.computer} hiện tại đang có vẻ cao: ${warning.temperature}°C🌡️`}
//                 color="white"
//                 size={20}
//                 styles={{paddingHorizontal: 2, paddingVertical: 2}}
//               />
//             </View>
//           ))
//         )}
//       </Container>
//     </View>
//   );
// };

// export default NotificationScreen;

// ver1

// import React, {useState, useEffect, useRef, useCallback} from 'react';
// import {
//   View,
//   Alert,
//   FlatList,
//   TouchableOpacity,
//   Text,
//   ScrollView,
// } from 'react-native';
// import database from '@react-native-firebase/database';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Container from '../../components/Container';
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
//   const computerTemps = useRef({
//     computer1: 0,
//     computer2: 0,
//     computer3: 0,
//     computer4: 0,
//   });

//   const fetchWarnings = useCallback(async () => {
//     try {
//       const storedWarnings = await AsyncStorage.getItem('warnings');
//       if (storedWarnings) {
//         setWarnings(JSON.parse(storedWarnings));
//       }
//     } catch (error) {
//       console.error('Error fetching warnings from storage:', error);
//     } finally {
//       setLoading(false);
//     }
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
//           if (temp > 40) {
//             newWarnings.push({
//               computer: key,
//               temperature: temp,
//               timestamp: new Date().toLocaleString(),
//             });
//           }
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
//     // Alert.alert(
//     //   'Xác nhận',
//     //   'Bạn có chắc chắn muốn xóa thông báo này?',
//     //   [
//     //     {
//     //       text: 'Hủy',
//     //       style: 'cancel',
//     //     },
//     //     {
//     //       text: 'Xóa',
//     //       onPress: () => {
//     //         setWarnings(prevWarnings => {
//     //           const updatedWarnings = prevWarnings.filter(
//     //             (_, i) => i !== index,
//     //           );
//     //           AsyncStorage.setItem('warnings', JSON.stringify(updatedWarnings));
//     //           return updatedWarnings;
//     //         });
//     //       },
//     //     },
//     //   ],
//     //   {cancelable: true},
//     // );

//     setWarnings(prevWarnings => {
//       const updatedWarnings = prevWarnings.filter((_, i) => i !== index);
//       AsyncStorage.setItem('warnings', JSON.stringify(updatedWarnings));
//       return updatedWarnings;
//     });
//   };

//   const renderWarning = ({item, index}: {item: Warning; index: number}) => (
//     <View
//       style={[
//         globalStyles.inputContainer,
//         {
//           marginHorizontal: 20,
//           marginVertical: 8,
//           backgroundColor: 'gray',
//           borderRadius: 12,
//           paddingVertical: 4,
//           alignItems: 'center',
//           justifyContent: 'center',
//           flex: 1,
//         },
//       ]}>
//       <TextComponent
//         text={`⚠️ Cảnh báo ⚠️`}
//         color="yellow"
//         size={20}
//         styles={{fontWeight: 'bold'}}
//       />
//       <TextComponent
//         text={`Nhiệt độ ${item.computer} hiện tại đang cao: ${item.temperature}°C🌡️`}
//         color="white"
//         size={20}
//         styles={{paddingHorizontal: 2, paddingVertical: 2}}
//       />
//       <Text
//         style={{
//           color: 'white',
//           fontSize: 12,
//           position: 'absolute',
//           bottom: 5,
//           right: 10,
//         }}>
//         {item.timestamp}
//       </Text>
//       <TouchableOpacity
//         style={{
//           position: 'absolute',
//           top: 5,
//           right: 5,
//           backgroundColor: 'transparent',
//         }}
//         onPress={() => handleDeleteWarning(index)}>
//         <Text style={{color: 'white', fontSize: 16}}>❌</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         {loading ? (
//           <TextComponent
//             color="black"
//             text="Đang tải dữ liệu..."
//             size={18}
//             styles={{textAlign: 'center', marginTop: 20}}
//           />
//         ) : warnings.length === 0 ? (
//           <View
//             style={[
//               globalStyles.inputContainer,
//               {
//                 backgroundColor: 'gray',
//                 marginHorizontal: 20,
//                 borderRadius: 12,
//                 paddingVertical: 20,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flex: 1,
//               },
//             ]}>
//             <TextComponent
//               color="white"
//               text="Hiện tại không có thông báo nào"
//               size={18}
//             />
//             <TextComponent
//               color="white"
//               text="Mọi thứ có vẻ đang bình thường"
//               size={18}
//             />
//           </View>
//         ) : (
//           <ScrollView>
//             <FlatList
//               horizontal={false}
//               data={warnings}
//               renderItem={renderWarning}
//               keyExtractor={(item, index) => index.toString()}
//             />
//           </ScrollView>
//         )}
//       </Container>
//     </View>
//   );
// };

// export default NotificationScreen;

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import database from '@react-native-firebase/database';
// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   ActivityIndicator,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   FlatList,
// } from 'react-native';
// import Animated, {LinearTransition} from 'react-native-reanimated';

// import Container from '../../components/Container';
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

//   const fetchWarnings = useCallback(async () => {
//     try {
//       const storedWarnings = await AsyncStorage.getItem('warnings');
//       if (storedWarnings) {
//         setWarnings(JSON.parse(storedWarnings));
//       }
//     } catch (error) {
//       console.error('Error fetching warnings from storage:', error);
//     } finally {
//       setLoading(false);
//     }
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
//           // Chỉ thêm thông báo nếu dữ liệu mới thay đổi so với lần trước
//           if (temp > 40 && temp !== previousData.current[key]) {
//             newWarnings.push({
//               computer: key,
//               temperature: temp,
//               timestamp: new Date().toLocaleString(),
//             });
//           }
//           // Cập nhật dữ liệu hiện tại
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

//   return (
//     <View style={{flex: 1, marginVertical: -8}}>
//       <Container isScroll>
//         {loading ? (
//           <View>
//             <ActivityIndicator color="blue" />
//             <TextComponent
//               color="black"
//               text="Đang tải dữ liệu..."
//               size={18}
//               styles={{textAlign: 'center', marginTop: 20}}
//             />
//           </View>
//         ) : warnings.length === 0 ? (
//           <View
//             style={[
//               globalStyles.inputContainer,
//               {
//                 backgroundColor: 'gray',
//                 marginHorizontal: 8,
//                 borderRadius: 12,
//                 paddingVertical: 20,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flex: 1,
//               },
//             ]}>
//             <TextComponent
//               color="white"
//               text="Hiện tại không có thông báo nào"
//               size={18}
//             />
//             <TextComponent
//               color="white"
//               text="Mọi thứ có vẻ đang bình thường"
//               size={18}
//             />
//           </View>
//         ) : (
//           <ScrollView>
//             {warnings
//               .slice()
//               .reverse()
//               .map((item, index) => (
//                 <Animated.View
//                   key={index}
//                   style={[
//                     globalStyles.inputContainer,
//                     {
//                       marginHorizontal: 20,
//                       marginVertical: 4,
//                       backgroundColor: 'rgba(255, 0, 0, 0.3)',
//                       borderRadius: 12,
//                       paddingVertical: 6,
//                       justifyContent: 'center',
//                       flex: 1,
//                     },
//                   ]}>
//                   <TextComponent
//                     text={`⚠️ Cảnh báo !!!`}
//                     color="yellow"
//                     size={20}
//                     styles={{fontWeight: 'bold'}}
//                   />
//                   <TextComponent
//                     text={`Nhiệt độ ${item.computer} hiện tại đang cao: ${item.temperature}°C🌡️`}
//                     color="white"
//                     size={20}
//                     styles={{paddingHorizontal: 2, paddingVertical: 2}}
//                   />
//                   <Text
//                     style={{
//                       color: 'white',
//                       fontSize: 12,
//                       position: 'absolute',
//                       bottom: 5,
//                       right: 10,
//                     }}>
//                     {item.timestamp}
//                   </Text>
//                   <TouchableOpacity
//                     style={{
//                       position: 'absolute',
//                       top: 5,
//                       right: 5,
//                       backgroundColor: 'transparent',
//                     }}
//                     onPress={() => handleDeleteWarning(index)}>
//                     <Text style={{color: 'white', fontSize: 16}}>❌</Text>
//                   </TouchableOpacity>
//                 </Animated.View>
//               ))}
//           </ScrollView>
//         )}
//       </Container>
//     </View>
//   );
// };

// export default NotificationScreen;

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
import Icon from 'react-native-vector-icons/AntDesign';

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

  const WarningItem: React.FC<{item: Warning; index: number}> = props => {
    const {item, index} = props;

    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter(vItem => vItem.isViewable)
          .find(vItem => vItem.index === index),
      );

      return {
        opacity: withTiming(isVisible ? 1 : 0.4),
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
          {/* <Text style={{color: 'white', fontSize: 16}}>❌</Text> */}
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
        <FlatList
          data={warnings.slice().reverse()}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{paddingVertical: 20}}
          onViewableItemsChanged={onViewableItemsChangedRef.current.callback}
          renderItem={({item, index}) => (
            <WarningItem item={item} index={index} />
          )}
        />
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
