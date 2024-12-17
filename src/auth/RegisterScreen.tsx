// import auth from '@react-native-firebase/auth';
// import {Lock, Sms} from 'iconsax-react-native';
// import React, {useEffect, useState} from 'react';
// import {Text} from 'react-native';
// import ButtonComponent from '../components/ButtonComponent';
// import Container from '../components/Container';
// import InputComponent from '../components/InputComponent';
// import RowComponent from '../components/RowComponent';
// import SectionComponent from '../components/SectionComponent';
// import SpaceComponent from '../components/SpaceComponent';
// import TextComponent from '../components/TextComponent';
// import TitleComponent from '../components/TitleComponent';
// import {colors} from '../constants/colors';
// import {globalStyles} from '../styles/globalStyles';

// const RegisterScreen = ({navigation}: any) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errorText, setErrorText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (email) {
//       setErrorText('');
//     }
//   }, [email]);

//   const handleCreateAccount = async () => {
//     if (!email) {
//       setErrorText('Please enter your email!!!');
//     } else if (!password || !confirmPassword) {
//       setErrorText('Please enter your password!!!');
//     } else if (password !== confirmPassword) {
//       setErrorText('Password is not match!!!');
//     } else if (password.length < 6) {
//       setErrorText('Password must be to 6 characters');
//     } else {
//       setIsLoading(true);
//       await auth()
//         .createUserWithEmailAndPassword(email, password)
//         .then(userCredential => {
//           const user = userCredential.user;

//           if (user) {
//             console.log(user);
//             setIsLoading(false);
//           }
//         })
//         .catch(error => {
//           setIsLoading(false);
//           setErrorText(error.message);
//         });
//     }
//   };
//   return (
//     <Container>
//       <SectionComponent
//         styles={{
//           flex: 1,
//           justifyContent: 'center',
//         }}>
//         <RowComponent styles={{marginBottom: 16}}>
//           <TitleComponent
//             color={colors.blue}
//             text="SIGN IN"
//             size={32}
//             flex={0}
//           />
//         </RowComponent>
//         <InputComponent
//           title="Email"
//           value={email}
//           onChange={val => setEmail(val)}
//           placeholder="Email"
//           prefix={<Sms size={22} color={colors.gray2} />}
//           allowClear
//           type="email-address"
//         />
//         <InputComponent
//           title="Password"
//           isPassword
//           value={password}
//           onChange={val => setPassword(val)}
//           placeholder="Password"
//           prefix={<Lock size={22} color={colors.gray2} />}
//         />
//         <InputComponent
//           title="Comfirm password"
//           isPassword
//           value={confirmPassword}
//           onChange={val => setConfirmPassword(val)}
//           placeholder="Comfirm password"
//           prefix={<Lock size={22} color={colors.gray2} />}
//         />

//         {errorText && <TextComponent text={errorText} color="coral" flex={0} />}
//         <SpaceComponent height={20} />

//         <ButtonComponent
//           isLoading={isLoading}
//           text="Register"
//           onPress={handleCreateAccount}
//         />

//         <RowComponent styles={{marginTop: 20}}>
//           <Text style={[globalStyles.text, {color: colors.gray2}]}>
//             You have an account?{' '}
//             <Text
//               style={{color: 'coral'}}
//               onPress={() => navigation.navigate('LoginScreen')}>
//               Login
//             </Text>
//           </Text>
//         </RowComponent>
//       </SectionComponent>
//     </Container>
//   );
// };

// export default RegisterScreen;

import auth from '@react-native-firebase/auth';
import {Lock, Sms, User} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, Text} from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import Container from '../components/Container';
import InputComponent from '../components/InputComponent';
import RowComponent from '../components/RowComponent';
import SectionComponent from '../components/SectionComponent';
import SpaceComponent from '../components/SpaceComponent';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import {colors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyles';

const RegisterScreen = ({navigation}: any) => {
  const [name, setName] = useState(''); // State cho tên người dùng
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (email) setErrorText('');
  }, [email]);

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      setErrorText('Vui lòng nhập họ và tên!');
    } else if (!email) {
      setErrorText('Vui lòng nhập email!');
    } else if (!password || !confirmPassword) {
      setErrorText('Vui lòng nhập mật khẩu!');
    } else if (password !== confirmPassword) {
      setErrorText('Mật khẩu không trùng nhau!');
    } else if (password.length < 6) {
      setErrorText('Mật khẩu cần ít nhất 6 ký tự!');
    } else {
      setIsLoading(true);
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const user = userCredential.user;

        if (user) {
          // Cập nhật tên người dùng vào profile
          await user.updateProfile({
            displayName: name,
          });
          console.log('User created:', user);
          Alert.alert('Thành công', 'Tài khoản đã được tạo thành công!');
          navigation.navigate('LoginScreen'); // Chuyển về màn hình đăng nhập
        }
      } catch (error: any) {
        setErrorText(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container>
      <SectionComponent
        styles={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <RowComponent styles={{marginBottom: 16}}>
          <TitleComponent
            color={colors.blue}
            text="ĐĂNG KÝ"
            size={32}
            flex={0}
          />
        </RowComponent>

        {/* Input cho tên người dùng */}
        <InputComponent
          title="Name"
          value={name}
          onChange={val => setName(val)}
          // placeholder="Enter your name"
          placeholder="Họ và tên"
          prefix={<User size={22} color={colors.gray2} />}
        />

        <InputComponent
          title="Email"
          value={email}
          onChange={val => setEmail(val)}
          placeholder="Nhập email"
          prefix={<Sms size={22} color={colors.gray2} />}
          allowClear
          type="email-address"
        />
        <InputComponent
          title="Password"
          isPassword
          value={password}
          onChange={val => setPassword(val)}
          placeholder="Mật khẩu"
          prefix={<Lock size={22} color={colors.gray2} />}
        />
        <InputComponent
          title="Confirm Password"
          isPassword
          value={confirmPassword}
          onChange={val => setConfirmPassword(val)}
          placeholder="Xác nhận mật khẩu"
          prefix={<Lock size={22} color={colors.gray2} />}
        />

        {errorText && <TextComponent text={errorText} color="coral" flex={0} />}
        <SpaceComponent height={20} />

        <ButtonComponent
          isLoading={isLoading}
          text="Đăng ký"
          onPress={handleCreateAccount}
        />

        <RowComponent styles={{marginTop: 20}}>
          <Text style={[globalStyles.text, {color: colors.gray2}]}>
            Bạn đã có tài khoản?
          </Text>
          <Text
            style={{color: 'coral', marginLeft: 2}}
            onPress={() => navigation.navigate('LoginScreen')}>
            Đăng nhập
          </Text>
        </RowComponent>
      </SectionComponent>
    </Container>
  );
};

export default RegisterScreen;
