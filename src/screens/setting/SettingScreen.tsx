// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {Logout} from 'iconsax-react-native';
// import React, {useEffect, useState} from 'react';
// import {Alert, Text, TouchableOpacity, View} from 'react-native';

// import Container from '../../components/Container';
// import RowComponent from '../../components/RowComponent';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const SettingScreen = () => {
//   // const handleSingout = async () => {
//   //   await auth().signOut();
//   // };

//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

//   const handleDangXuat = () => {
//     Alert.alert('Xác nhận', 'Bạn có thật sự muốn đăng xuất không?', [
//       {text: 'Hủy', style: 'cancel'},
//       {text: 'Đồng ý', onPress: async () => await auth().signOut()},
//     ]);
//   };

//   useEffect(() => {
//     // Lắng nghe sự thay đổi trạng thái người dùng (nếu có)
//     const subscriber = auth().onAuthStateChanged(user => {
//       setUser(user); // Lưu thông tin người dùng vào state
//     });

//     return subscriber; // Hủy lắng nghe khi component unmount
//   }, []);

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         <TextComponent
//           styles={[
//             globalStyles.inputContainer,
//             {
//               backgroundColor: '#DEDEDF',
//               marginHorizontal: 20,
//             },
//           ]}
//           color="black"
//           text="Chào bạn, chúc bạn một ngày tốt lành khi sử dụng ứng dụng. 🙂"
//           size={16}
//         />
//         <TouchableOpacity onPress={handleDangXuat}>
//           <RowComponent
//             styles={[
//               globalStyles.inputContainer,
//               {
//                 paddingHorizontal: 20,
//                 backgroundColor: '#6998FF',
//                 marginHorizontal: 20,
//                 marginVertical: 20,
//               },
//             ]}>
//             <TextComponent size={16} text="Đăng xuất" color="white" />

//             <Logout size={25} color="white" />
//           </RowComponent>
//         </TouchableOpacity>

//         <Text style={{color: 'black'}}>
//           Welcome {user ? user.email : 'Guest'}
//         </Text>
//       </Container>
//     </View>
//   );
// };

// export default SettingScreen;

// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {Logout} from 'iconsax-react-native';
// import React, {useEffect, useState} from 'react';
// import {
//   Alert,
//   Text,
//   TextInput,
//   Touchable,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';
// import IconEdit from 'react-native-vector-icons/FontAwesome5';

// import Container from '../../components/Container';
// import RowComponent from '../../components/RowComponent';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';
// import {colors} from '../../constants/colors';

// const SettingScreen = () => {
//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
//   const [name, setName] = useState(''); // State để lưu tên nhập vào
//   const [isUpdating, setIsUpdating] = useState(false); // State loading khi cập nhật

//   // Đăng xuất
//   const handleDangXuat = () => {
//     Alert.alert('Xác nhận', 'Bạn có thật sự muốn đăng xuất không?', [
//       {text: 'Hủy', style: 'cancel'},
//       {text: 'Đồng ý', onPress: async () => await auth().signOut()},
//     ]);
//   };

//   // Lắng nghe trạng thái người dùng
//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(user => {
//       setUser(user);
//       setName(user?.displayName || ''); // Nếu có displayName thì hiển thị
//     });
//     return subscriber; // Cleanup listener
//   }, []);

//   // Hàm cập nhật tên người dùng
//   const handleUpdateName = async () => {
//     if (!name.trim()) {
//       Alert.alert('Lỗi', 'Tên không được để trống.');
//       return;
//     }

//     try {
//       setIsUpdating(true);
//       await user?.updateProfile({
//         displayName: name, // Tên có dấu tiếng Việt
//       });
//       Alert.alert('Thành công', 'Cập nhật tên thành công.');
//       setUser(auth().currentUser); // Làm mới thông tin user
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật tên.');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         {/* Thông báo chào */}
//         <View
//           style={[
//             globalStyles.inputContainer,
//             {
//               marginHorizontal: 20,
//               flex: 1,
//               flexDirection: 'row',
//               alignItems: 'center',
//               marginVertical: 12,
//             },
//           ]}>
//           <Icon
//             name="user-circle-o"
//             size={43}
//             style={{
//               flex: 0.2,
//               color: 'gray',
//             }}
//           />
//           <Text
//             style={{
//               paddingLeft: 12,
//               fontSize: 18,
//               flex: 0.9,
//               color: colors.gray2,
//             }}>
//             {user ? user.displayName || user.email : 'Guest'}
//           </Text>
//           <TouchableOpacity style={{flex: 0.2}} onPress={() => {}}>
//             <IconEdit name="edit" size={20} />
//           </TouchableOpacity>
//         </View>

//         <TextComponent
//           styles={[
//             globalStyles.inputContainer,
//             {
//               backgroundColor: '#DEDEDF',
//               marginHorizontal: 20,
//             },
//           ]}
//           color="black"
//           text="Chào bạn, chúc bạn một ngày tốt lành khi sử dụng ứng dụng. 🙂"
//           size={16}
//         />

//         {/* Ô nhập tên người dùng */}
//         {/* <View
//           style={{
//             marginHorizontal: 20,
//             marginVertical: 10,
//           }}>
//           <Text style={{color: 'black', marginBottom: 5, fontSize: 16}}>
//             Nhập tên của bạn:
//           </Text>
//           <TextInput
//             value={name}
//             onChangeText={text => setName(text)}
//             placeholder="Nhập tên của bạn"
//             placeholderTextColor="#888"
//             style={{
//               borderWidth: 1,
//               borderColor: '#ccc',
//               borderRadius: 8,
//               padding: 10,
//               color: 'black',
//             }}
//           />
//           <TouchableOpacity
//             onPress={handleUpdateName}
//             disabled={isUpdating}
//             style={{
//               backgroundColor: '#6998FF',
//               padding: 10,
//               borderRadius: 8,
//               marginTop: 10,
//               alignItems: 'center',
//             }}>
//             <Text style={{color: 'white', fontSize: 16}}>
//               {isUpdating ? 'Đang cập nhật...' : 'Cập nhật tên'}
//             </Text>
//           </TouchableOpacity>
//         </View> */}

//         {/* Nút Đăng xuất */}
//         <TouchableOpacity onPress={handleDangXuat}>
//           <RowComponent
//             styles={[
//               globalStyles.inputContainer,
//               {
//                 paddingHorizontal: 20,
//                 backgroundColor: '#6998FF',
//                 marginHorizontal: 20,
//                 marginVertical: 20,
//               },
//             ]}>
//             <TextComponent size={16} text="Đăng xuất" color="white" />
//             <Logout size={25} color="white" />
//           </RowComponent>
//         </TouchableOpacity>

//         {/* Hiển thị tên người dùng */}
//         {/* <Text style={{color: 'black', textAlign: 'center', marginTop: 20}}>
//           Welcome {user ? user.displayName || user.email : 'Guest'}
//         </Text> */}
//         {/* <Icon name="user-circle-o" size={43} /> */}
//       </Container>
//     </View>
//   );
// };

// export default SettingScreen;

// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {Logout} from 'iconsax-react-native';
// import React, {useEffect, useState} from 'react';
// import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';
// import IconEdit from 'react-native-vector-icons/FontAwesome5';

// import Container from '../../components/Container';
// import RowComponent from '../../components/RowComponent';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';
// import {colors} from '../../constants/colors';

// const SettingScreen = () => {
//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
//   const [name, setName] = useState(''); // State để lưu tên nhập vào
//   const [isEditing, setIsEditing] = useState(false); // State kiểm soát TextInput
//   const [isUpdating, setIsUpdating] = useState(false); // State loading khi cập nhật

//   // Đăng xuất
//   const handleDangXuat = () => {
//     Alert.alert('Xác nhận', 'Bạn có thật sự muốn đăng xuất không?', [
//       {text: 'Hủy', style: 'cancel'},
//       {text: 'Đồng ý', onPress: async () => await auth().signOut()},
//     ]);
//   };

//   // Lắng nghe trạng thái người dùng
//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(user => {
//       setUser(user);
//       setName(user?.displayName || ''); // Nếu có displayName thì hiển thị
//     });
//     return subscriber; // Cleanup listener
//   }, []);

//   // Hàm cập nhật tên người dùng
//   const handleUpdateName = async () => {
//     if (!name.trim()) {
//       Alert.alert('Lỗi', 'Tên không được để trống.');
//       return;
//     }

//     try {
//       setIsUpdating(true);
//       await user?.updateProfile({
//         displayName: name, // Tên có dấu tiếng Việt
//       });
//       Alert.alert('Thành công', 'Cập nhật tên thành công.');
//       setUser(auth().currentUser); // Làm mới thông tin user
//       setIsEditing(false); // Ẩn TextInput sau khi cập nhật
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật tên.');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         {/* Thông báo chào */}
//         <View
//           style={[
//             globalStyles.inputContainer,
//             {
//               marginHorizontal: 20,
//               flexDirection: 'row',
//               marginVertical: 12,
//               alignItems: 'center',
//               justifyContent: 'center',
//             },
//           ]}>
//           <Icon
//             name="user-circle-o"
//             size={43}
//             style={{
//               flex: 0.2,
//               color: 'gray',
//             }}
//           />

//           {/* Nếu đang Edit thì hiện TextInput */}
//           {isEditing ? (
//             <TextInput
//               value={name}
//               onChangeText={text => setName(text)}
//               placeholder="Nhập tên của bạn"
//               placeholderTextColor="#888"
//               style={[
//                 {
//                   flex: 0.9,
//                   borderBottomWidth: 1,
//                   borderColor: '#ccc',
//                   fontSize: 20,
//                   color: 'blue',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 },
//                 globalStyles.inputContainer,
//               ]}
//             />
//           ) : (
//             <Text
//               style={{
//                 paddingLeft: 12,
//                 fontSize: 20,
//                 flex: 0.9,
//                 color: colors.gray2,
//               }}>
//               {user ? user.displayName || user.email : 'Guest'}
//             </Text>
//           )}

//           {/* Nút Edit / Save */}
//           <TouchableOpacity
//             style={{flex: 0.2, paddingTop: 0}}
//             onPress={() => {
//               if (isEditing) {
//                 handleUpdateName(); // Lưu tên khi đang chỉnh sửa
//               } else {
//                 setIsEditing(true); // Bật chế độ chỉnh sửa
//               }
//             }}>
//             <IconEdit
//               name={isEditing ? 'save' : 'edit'}
//               size={25}
//               // style={{backgroundColor: 'green'}}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Lời chào */}
//         <TextComponent
//           styles={[
//             globalStyles.inputContainer,
//             {
//               backgroundColor: '#DEDEDF',
//               marginHorizontal: 20,
//             },
//           ]}
//           color="black"
//           text="Chào bạn, chúc bạn một ngày tốt lành khi sử dụng ứng dụng. 🙂"
//           size={16}
//         />

//         {/* Nút Đăng xuất */}
//         <TouchableOpacity onPress={handleDangXuat}>
//           <RowComponent
//             styles={[
//               globalStyles.inputContainer,
//               {
//                 paddingHorizontal: 20,
//                 backgroundColor: '#6998FF',
//                 marginHorizontal: 20,
//                 marginVertical: 20,
//               },
//             ]}>
//             <TextComponent size={16} text="Đăng xuất" color="white" />
//             <Logout size={25} color="white" />
//           </RowComponent>
//         </TouchableOpacity>
//       </Container>
//     </View>
//   );
// };

// export default SettingScreen;

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Logout} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, TextInput, TouchableOpacity, View} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconEdit from 'react-native-vector-icons/FontAwesome5';

import Container from '../../components/Container';
import RowComponent from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';
import {colors} from '../../constants/colors';

const SettingScreen = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [name, setName] = useState(''); // State để lưu tên nhập vào
  const [isEditing, setIsEditing] = useState(false); // State kiểm soát chế độ chỉnh sửa
  const [isUpdating, setIsUpdating] = useState(false); // State loading khi cập nhật

  // Đăng xuất
  const handleDangXuat = () => {
    Alert.alert('Xác nhận', 'Bạn có thật sự muốn đăng xuất không?', [
      {text: 'Hủy', style: 'cancel'},
      {text: 'Đồng ý', onPress: async () => await auth().signOut()},
    ]);
  };

  // Lắng nghe trạng thái người dùng
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
      setName(user?.displayName || ''); // Nếu có displayName thì hiển thị
    });
    return subscriber; // Cleanup listener
  }, []);

  // Hàm cập nhật tên người dùng
  const handleUpdateName = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Tên không được để trống.');
      return;
    }

    try {
      setIsUpdating(true);
      await user?.updateProfile({
        displayName: name, // Tên có dấu tiếng Việt
      });
      Alert.alert('Thành công', 'Cập nhật tên thành công.');
      setUser(auth().currentUser); // Làm mới thông tin user
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật tên.');
    } finally {
      setIsUpdating(false);
      setIsEditing(false); // Tắt chế độ chỉnh sửa
    }
  };

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        {/* Phần tên người dùng */}
        <View
          style={[
            globalStyles.inputContainer,
            {
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 12,
            },
          ]}>
          <Icon
            name="user-circle-o"
            size={43}
            color="gray"
            style={{marginRight: 10}}
          />

          {/* TextInput (hiển thị tên và chỉnh sửa) */}
          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            editable={isEditing} // Chỉ cho phép chỉnh sửa khi nhấn Edit
            placeholder="Nhập tên của bạn"
            placeholderTextColor="#888"
            style={{
              flex: 1,
              borderBottomWidth: isEditing ? 1 : 0, // Gạch chân khi chỉnh sửa
              borderColor: '#ccc',
              fontSize: 18,
              color: isEditing ? 'coral' : 'black',
              paddingVertical: 0,
              marginRight: isEditing ? 16 : 0,
              // backgroundColor: 'yellow',
            }}
          />

          {/* Nút Edit / Save */}
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                handleUpdateName(); // Lưu tên khi nhấn Save
              } else {
                setIsEditing(true); // Bật chế độ chỉnh sửa
              }
            }}
            style={{marginRight: 8}}>
            {/* <IconEdit
              name={isEditing ? 'save' : 'edit'}
              size={20}
              color={isEditing ? 'green' : 'black'}
            /> */}
            {isEditing ? (
              <IconEdit name="save" size={26} color={'coral'} />
            ) : (
              <IconEdit name="edit" size={20} color={'gray'} />
            )}
          </TouchableOpacity>
        </View>

        {/* Lời chào */}
        <TextComponent
          styles={[
            globalStyles.inputContainer,
            {
              backgroundColor: '#DEDEDF',
              marginHorizontal: 20,
            },
          ]}
          color="black"
          text="Chào bạn, chúc bạn một ngày tốt lành khi sử dụng ứng dụng. 🙂"
          size={16}
        />

        <TouchableOpacity onPress={handleDangXuat}>
          <RowComponent
            styles={[
              globalStyles.inputContainer,
              {
                paddingHorizontal: 20,
                backgroundColor: '#6998FF',
                marginHorizontal: 20,
                marginVertical: 10,
              },
            ]}>
            <TextComponent size={17} text="Đăng xuất" color="white" />
            <Logout size={25} color="white" />
          </RowComponent>
        </TouchableOpacity>
      </Container>
    </View>
  );
};

export default SettingScreen;
