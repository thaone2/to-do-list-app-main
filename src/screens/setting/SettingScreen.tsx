// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {Logout} from 'iconsax-react-native';
// import React, {useEffect, useState} from 'react';
// import {Alert, Keyboard, TextInput, TouchableOpacity, View} from 'react-native';

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
//   const [isEditing, setIsEditing] = useState(false); // State kiểm soát chế độ chỉnh sửa
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
//       setIsEditing(false); // Tắt chế độ chỉnh sửa
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         {/* Phần tên người dùng */}
//         <View
//           style={[
//             globalStyles.inputContainer,
//             {
//               marginHorizontal: 20,
//               flexDirection: 'row',
//               alignItems: 'center',
//               marginVertical: 12,
//             },
//           ]}>
//           <Icon
//             name="user-circle-o"
//             size={43}
//             color="gray"
//             style={{marginRight: 10}}
//           />

//           {/* TextInput (hiển thị tên và chỉnh sửa) */}
//           <TextInput
//             value={name}
//             onChangeText={text => setName(text)}
//             editable={isEditing} // Chỉ cho phép chỉnh sửa khi nhấn Edit
//             placeholder="Nhập tên của bạn"
//             placeholderTextColor="#888"
//             style={{
//               flex: 1,
//               borderBottomWidth: isEditing ? 1 : 0, // Gạch chân khi chỉnh sửa
//               borderColor: '#ccc',
//               fontSize: 18,
//               color: isEditing ? 'coral' : 'black',
//               paddingVertical: 0,
//               marginRight: isEditing ? 16 : 0,
//               // backgroundColor: 'yellow',
//             }}
//           />

//           {/* Nút Edit / Save */}

//           <TouchableOpacity
//             onPress={() => {
//               if (isEditing) {
//                 Keyboard.dismiss(); // Đóng bàn phím trước khi lưu
//                 handleUpdateName(); // Lưu tên khi nhấn Save
//               } else {
//                 setIsEditing(true); // Bật chế độ chỉnh sửa
//               }
//             }}
//             style={{marginRight: 8}}>
//             {isEditing ? (
//               <IconEdit name="save" size={26} color={'coral'} />
//             ) : (
//               <IconEdit name="edit" size={20} color={'gray'} />
//             )}
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

//         <TouchableOpacity onPress={handleDangXuat}>
//           <RowComponent
//             styles={[
//               globalStyles.inputContainer,
//               {
//                 paddingHorizontal: 20,
//                 backgroundColor: '#6998FF',
//                 marginHorizontal: 20,
//                 marginVertical: 10,
//               },
//             ]}>
//             <TextComponent size={17} text="Đăng xuất" color="white" />
//             <Logout size={25} color="white" />
//           </RowComponent>
//         </TouchableOpacity>
//       </Container>
//     </View>
//   );
// };

// export default SettingScreen;

// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {Logout} from 'iconsax-react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {Alert, Keyboard, TextInput, TouchableOpacity, View} from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';
// import IconEdit from 'react-native-vector-icons/FontAwesome5';

// import Container from '../../components/Container';
// import RowComponent from '../../components/RowComponent';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const SettingScreen = () => {
//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
//   const [name, setName] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
//   const textInputRef = useRef<TextInput>(null); // Tham chiếu tới TextInput
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(user => {
//       setUser(user);
//       setName(user?.displayName || '');
//     });
//     return subscriber;
//   }, []);

//   const handleSaveName = async () => {
//     if (!name.trim()) return; // Không lưu nếu tên rỗng

//     setIsSaving(true);
//     try {
//       await user?.updateProfile({displayName: name});
//       setUser(auth().currentUser);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsSaving(false);
//       // Keyboard.dismiss(); // Đóng bàn phím sau khi lưu
//       textInputRef.current?.focus(); // Hiện bàn phím
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         <View
//           style={[
//             globalStyles.inputContainer,
//             {
//               marginHorizontal: 20,
//               flexDirection: 'row',
//               alignItems: 'center',
//               marginVertical: 12,
//             },
//           ]}>
//           <Icon
//             name="user-circle-o"
//             size={43}
//             color="gray"
//             style={{marginRight: 10}}
//           />

//           <TextInput
//             value={name}
//             // onChangeText={text => setName(text)}
//             onChangeText={text => setName(text)}
//             editable={isEditing} // Chỉ chỉnh sửa nếu `count === 1`
//             placeholder="Nhập tên của bạn"
//             placeholderTextColor="#888"
//             style={{
//               flex: 1,
//               borderBottomWidth: isEditing ? 1 : 0,
//               borderColor: '#ccc',
//               fontSize: 18,
//               color: isEditing ? 'coral' : 'black',
//               paddingVertical: 0,
//               marginRight: isEditing ? 16 : 0,
//             }}
//             onSubmitEditing={handleSaveName} // Lưu khi nhấn Enter trên bàn phím
//             // returnKeyType="done" // Hiển thị nút "Done" trên bàn phím
//           />

//           <TouchableOpacity
//             onPress={() => {
//               setIsEditing(!isEditing);
//             }}
//             style={{marginRight: 8}}
//             disabled={isSaving}>
//             <IconEdit
//               name={isEditing ? 'save' : 'edit'}
//               size={isEditing ? 26 : 20}
//               color={isSaving ? 'gray' : isEditing ? 'coral' : 'gray'}
//             />
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

//         <TouchableOpacity
//           onPress={() => {
//             Alert.alert('Xác nhận', 'Bạn có thật sự muốn đăng xuất không?', [
//               {text: 'Hủy', style: 'cancel'},
//               {text: 'Đồng ý', onPress: async () => await auth().signOut()},
//             ]);
//           }}>
//           <RowComponent
//             styles={[
//               globalStyles.inputContainer,
//               {
//                 paddingHorizontal: 20,
//                 backgroundColor: '#6998FF',
//                 marginHorizontal: 20,
//                 marginVertical: 10,
//               },
//             ]}>
//             <TextComponent size={17} text="Đăng xuất" color="white" />
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
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Keyboard, TextInput, TouchableOpacity, View} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconEdit from 'react-native-vector-icons/FontAwesome5';

import Container from '../../components/Container';
import RowComponent from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import {globalStyles} from '../../styles/globalStyles';

const SettingScreen = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef<TextInput>(null); // Tham chiếu tới TextInput

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
      setName(user?.displayName || '');
    });

    return subscriber;
  }, []);

  console.log(isEditing);

  // const handleEditOrSave = async () => {
  //   if (isEditing) {
  //     // Nếu đang chỉnh sửa, lưu và đóng bàn phím
  //     if (!name.trim()) {
  //       Alert.alert('Lỗi', 'Tên không được để trống.');
  //       return;
  //     }
  //     try {
  //       await user?.updateProfile({displayName: name});
  //       setUser(auth().currentUser); // Cập nhật thông tin người dùng
  //       Alert.alert('Thành công', 'Tên đã được cập nhật.');
  //     } catch (error) {
  //       console.error(error);
  //       Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật tên.');
  //     }
  //     Keyboard.dismiss(); // Đóng bàn phím
  //   } else {
  //     // Nếu không chỉnh sửa, mở bàn phím
  //     setTimeout(() => textInputRef.current?.focus(), 0);
  //   }

  //   // Chuyển đổi trạng thái
  //   setIsEditing(!isEditing);
  // };
  const handleEditOrSave = async () => {
    if (isEditing) {
      // Nếu đang chỉnh sửa, lưu và đóng bàn phím
      if (!name.trim()) {
        Alert.alert('Lỗi', 'Tên không được để trống.');
        return;
      }
      Keyboard.dismiss(); // Đóng bàn phím trước
      setTimeout(async () => {
        try {
          await user?.updateProfile({displayName: name});
          setUser(auth().currentUser); // Cập nhật thông tin người dùng
          Alert.alert('Thành công', 'Tên đã được cập nhật.');
        } catch (error) {
          console.error(error);
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật tên.');
        }
        setIsEditing(false); // Tắt chế độ chỉnh sửa
      }, 100); // Đợi 100ms để bàn phím đóng hoàn toàn
    } else {
      // Nếu không chỉnh sửa, mở bàn phím
      setIsEditing(true);
      setTimeout(() => textInputRef.current?.focus(), 10);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
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

          <TextInput
            ref={textInputRef} // Liên kết TextInput với ref
            value={name}
            onChangeText={text => setName(text)}
            editable={isEditing} // Chỉ chỉnh sửa khi `isEditing` bật
            placeholder="Nhập tên của bạn"
            placeholderTextColor="#888"
            style={{
              flex: 1,
              borderBottomWidth: isEditing ? 1 : 0,
              borderColor: 'gray',
              fontSize: 18,
              color: isEditing ? 'rgb(126, 73, 3)' : 'gray',
              paddingVertical: 0,
              marginRight: isEditing ? 16 : 0,
              fontFamily: fontFamilies.TextTitle,
            }}
            onSubmitEditing={handleEditOrSave} // Lưu khi nhấn Enter trên bàn phím
            returnKeyType="done" // Hiển thị nút "Done" trên bàn phím
          />
          <TouchableOpacity onPress={handleEditOrSave} style={{marginRight: 8}}>
            <IconEdit
              name={isEditing ? 'save' : 'edit'}
              size={isEditing ? 26 : 20}
              color={isEditing ? 'rgb(126, 73, 3)' : 'gray'}
            />
          </TouchableOpacity>
        </View>

        <TextComponent
          styles={[
            globalStyles.inputContainer,
            {
              // backgroundColor: '#DEDEDF',
              backgroundColor: 'hsl(30, 16.70%, 88.20%)',
              textAlign: 'left',
              marginHorizontal: 20,
              fontFamily: fontFamilies.Hello,
            },
          ]}
          color="black"
          text={`Xin chào ${name}, \nChúc bạn một ngày tốt lành khi sử dụng ứng dụng. 🙂`}
          size={16}
        />

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Xác nhận', 'Bạn có thật sự muốn đăng xuất không?', [
              {text: 'Hủy', style: 'cancel'},
              {text: 'Đồng ý', onPress: async () => await auth().signOut()},
            ]);
          }}>
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
