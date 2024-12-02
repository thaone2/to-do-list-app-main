import auth from '@react-native-firebase/auth';
import {Lock, Sms} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Alert, Text} from 'react-native';

import ButtonComponent from '../components/ButtonComponent';
import Container from '../components/Container';
import InputComponent from '../components/InputComponent';
import RowComponent from '../components/RowComponent';
import SectionComponent from '../components/SectionComponent';
import TitleComponent from '../components/TitleComponent';
import {colors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyles';
import TextComponent from '../components/TextComponent';

// const LoginScreen = ({navigation}: any) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorText, setErrorText] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setErrorText('Please enter your email and password!!!');
//     } else {
//       setErrorText('');
//       setIsLoading(true);
//       await auth()
//         .signInWithEmailAndPassword(email, password)
//         .then(userCredential => {
//           const user = userCredential.user;

//           if (user) {
//             console.log(user);
//             setIsLoading(false);
//           }
//         })
//         .catch(error => {
//           setErrorText(error.message);
//           setIsLoading(false);
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
//           <TitleComponent color="white" text="LOGIN" size={36} flex={0} />
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

//         <ButtonComponent
//           isLoading={isLoading}
//           text="Login"
//           onPress={handleLogin}
//           color="#3EE8F1"
//         />

//         <RowComponent styles={{marginTop: 20}}>
//           <Text style={[globalStyles.text]}>
//             You don't have an account?{' '}
//             <Text
//               style={{color: 'coral'}}
//               onPress={() => navigation.navigate('RegisterScreen')}>
//               Create an account
//             </Text>
//           </Text>
//         </RowComponent>
//       </SectionComponent>
//     </Container>
//   );
// };

// export default LoginScreen;

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorText('Vui lòng nhập email và password !!!');
      // Hiển thị thông báo lỗi dạng Alert
      Alert.alert('Lỗi', 'Vui lòng nhập email và password !!!', [
        {text: 'OK', style: 'cancel'},
      ]);
    } else {
      setErrorText('');
      setIsLoading(true);
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;

          if (user) {
            console.log(user);
            setIsLoading(false);
          }
        })
        .catch(error => {
          setErrorText(error.message);
          setIsLoading(false);

          // Hiển thị thông báo lỗi dưới dạng Alert
          Alert.alert('Đăng nhập thất bại', error.message, [
            {text: 'OK', style: 'cancel'},
          ]);
        });
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
          <TitleComponent color="coral" text="LOGIN" size={36} flex={0} />
        </RowComponent>

        <InputComponent
          title="Email"
          value={email}
          onChange={val => setEmail(val)}
          placeholder="Email"
          prefix={<Sms size={22} color="coral" />}
          allowClear
          type="email-address"
          styles={{flex: 0, alignItems: 'center'}}
        />

        <InputComponent
          title="Password"
          isPassword
          value={password}
          onChange={val => setPassword(val)}
          placeholder="Password"
          prefix={<Lock size={22} color="coral" />}
        />

        <ButtonComponent
          isLoading={isLoading}
          text="Login"
          onPress={handleLogin}
          color="coral"
        />

        <RowComponent styles={{marginTop: 20}}>
          <Text style={[globalStyles.text, {color: colors.gray2}]}>
            You don't have an account?
            <Text
              style={{color: 'coral'}}
              onPress={() => navigation.navigate('RegisterScreen')}>
              Create an account
            </Text>
          </Text>
        </RowComponent>
      </SectionComponent>
    </Container>
  );
};

export default LoginScreen;
