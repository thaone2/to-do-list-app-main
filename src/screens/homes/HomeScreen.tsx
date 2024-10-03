import {
  Add,
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal1,
  Calendar,
  Clock,
  Home2,
  Notification1,
  ChartSquare,
  Setting3,
} from 'iconsax-react-native';

import React, {useEffect, useRef, useState} from 'react';
import {
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AvatarGroup from '../../components/AvatarGroup';
import CardComponent from '../../components/CardComponent';
import CardImageConponent from '../../components/CardImageConponent';
import CicularComponent from '../../components/CicularComponent';
import Container from '../../components/Container';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TagComponent from '../../components/TagComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {globalStyles} from '../../styles/globalStyles';
import auth from '@react-native-firebase/auth';
import {Dimensions} from 'react-native';
import SwitchComponent from '../../components/SwitchComponent';
import moment from 'moment';
import 'moment/locale/vi'; // Để hiển thị thứ bằng tiếng Việt
import database from '@react-native-firebase/database';
import ComputerImageComponent from '../../components/ComputerImageComponent';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingScreen from '../setting/SettingScreen';

const HomeScreen = ({navigation}: any) => {
  const handleSingout = async () => {
    await auth().signOut();
  };

  const screenWidth = Dimensions.get('window').width;
  const timeRef = useRef(moment().format('HH:mm:ss'));
  const dateRef = useRef(moment().format('dddd, DD/MM/YYYY')); // Hiển thị thứ

  const [time, setTime] = useState(timeRef.current);
  const [date, setDate] = useState(dateRef.current);

  const [computerStatuses, setComputerStatuses] = useState({
    computer1: 0,
    computer2: 0,
    computer3: 0,
    computer4: 0,
  });

  const [hlkRadarValue, setHlkRadarValue] = useState(0);
  useEffect(() => {
    const databaseHLKRef = database().ref('HLK_RADAR/status');

    // Lắng nghe sự thay đổi của dữ liệu
    const listener = databaseHLKRef.on('value', snapshot => {
      const status = snapshot.val(); // Lấy giá trị status từ Firebase
      setHlkRadarValue(status); // Cập nhật state
    });

    return () => {
      databaseHLKRef.off('value', listener); // Dọn dẹp listener khi component bị unmount
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = moment().format('HH:mm:ss');
      const currentDate = moment().format('dddd, DD/MM/YYYY');

      timeRef.current = currentTime;
      dateRef.current = currentDate;

      setTime(currentTime);
      setDate(currentDate);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const databaseRef = database().ref('Computer');

    const listener = databaseRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setComputerStatuses({
          computer1: data.computer1?.status || 0,
          computer2: data.computer2?.status || 0,
          computer3: data.computer3?.status || 0,
          computer4: data.computer4?.status || 0,
        });
      }
    });

    // Clean up the listener
    return () => {
      databaseRef.off('value', listener);
    };
  }, []);

  const handleSwitchChange = (computerId: any, newValue: any) => {
    setComputerStatuses(prevStatuses => ({
      ...prevStatuses,
      [computerId]: newValue ? 1 : 0,
    }));

    // Update the status in Firebase
    database()
      .ref(`Computer/${computerId}`)
      .set({status: newValue ? 1 : 0})
      .then(() => {
        console.log(`Status of ${computerId} updated successfully.`);
      })
      .catch(error => {
        console.error(`Failed to update ${computerId} status:`, error);
      });
  };

  return (
    <View style={{flex: 1}}>
      {/* <SectionComponent
        styles={{
          paddingVertical: 23,
          backgroundColor: colors.bgColor,
          marginTop: 0,
          marginBottom: -10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <RowComponent>
          <View
            style={{
              flex: 1,
            }}>
            <TextComponent
              styles={{color: 'black', fontWeight: 'bold', fontSize: 20}}
              text="HomeScreen"
            />
          </View>
          <TouchableOpacity onPress={handleSingout}>
            <Logout size={34} color="coral" />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent> */}
      <Container isScroll>
        <SectionComponent>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CardImageConponent color="rgba(67, 159, 238, 0.9)">
              <Calendar size="32" color="#FF8A65" />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <TextComponent
                  color="white"
                  font="semiBold"
                  size={20}
                  text={date}
                  styles={{textTransform: 'capitalize', fontWeight: 'bold'}}
                />
              </View>
            </CardImageConponent>

            <CardImageConponent styles={{}} color="rgba(3, 255, 125, 0.5)">
              <Clock size="32" color="#FF8A65" />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: 2,
                  width: 100,
                }}>
                <TextComponent
                  color="white"
                  font="semiBold"
                  size={20}
                  text={time}
                  styles={{fontWeight: 'bold'}}
                />
              </View>
            </CardImageConponent>
          </View>
        </SectionComponent>
        {/* <SectionComponent styles={{flex: 1, flexDirection: 'row'}}>
          <ImageBackground
            source={require('../../assets/images/logo-iuh.png')}
            imageStyle={{borderRadius: 12}}
            style={[
              globalStyles.card,
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(113, 77, 217, 0.2)',
                borderRadius: 14,
              },
            ]}>
            <View
              style={[
                {
                  flex: 1,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <TextComponent
                styles={[
                  {
                    color: 'white',
                    fontWeight: 'bold',
                  },
                ]}
                text="HLK Radar Sensor"
                size={18}
              />
              <TextComponent
                color="black"
                size={14}
                text="Trạng thái cảm biến"
              />

              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50 / 2,
                  backgroundColor: '#5DF15A', //mau xanh
                  marginTop: 4,
                }}></View>
            </View>
          </ImageBackground>
        </SectionComponent> */}

        <SectionComponent styles={{flex: 1, flexDirection: 'row'}}>
          <ImageBackground
            source={require('../../assets/images/logo-iuh.png')}
            imageStyle={{borderRadius: 12}}
            style={[
              globalStyles.card,
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(113, 77, 217, 0.2)',
                borderRadius: 14,
              },
            ]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(190, 198, 200, 0.6)',
                borderRadius: 12,
                width: screenWidth - 40,
              }}>
              <TextComponent
                styles={{
                  color: 'purple',
                  fontWeight: 'bold',
                }}
                text="HLK Radar Sensor"
                size={20}
              />
              <TextComponent
                color="black"
                size={20}
                text="Trạng thái cảm biến"
                styles={{fontWeight: 'bold'}}
              />

              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50 / 2,
                  backgroundColor: hlkRadarValue === 1 ? '#5DF15A' : '#FF6347', // Xanh lá khi có người, đỏ khi không
                  marginTop: 4,
                }}
              />

              <TextComponent
                color={hlkRadarValue === 1 ? '#5DF15A' : '#FF6347'}
                size={20}
                text={
                  hlkRadarValue === 1
                    ? '✔️ Có người trong phòng'
                    : '⚠️ Không có người trong phòng'
                }
                styles={{
                  marginTop: 10,
                  backgroundColor: 'rgba(226, 238, 240, 1)',
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              />
            </View>
          </ImageBackground>
        </SectionComponent>

        {/* computer */}
        <SectionComponent
          styles={{
            flex: 1,
            flexDirection: 'row',
            // width: screenWidth - 40,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ComputerImageComponent
            styles={{
              borderRadius: 12,
              paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
              paddingVertical: 12,
              backgroundColor: 'rgba(106, 248, 253, 0.3)',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  padding: 2,
                  borderRadius: 10,
                }}
                color="gray"
                size={18}
                text="Computer 1"
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer1 === 1}
                onValueChange={value => handleSwitchChange('computer1', value)}
              />
            </View>
          </ComputerImageComponent>
          <ComputerImageComponent
            styles={{
              borderRadius: 12,
              paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
              paddingVertical: 12,
              backgroundColor: 'rgba(106, 248, 253, 0.3)',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  padding: 2,
                  borderRadius: 10,
                }}
                color="gray"
                size={18}
                text="Computer 2"
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer2 === 1}
                onValueChange={value => handleSwitchChange('computer2', value)}
              />
            </View>
          </ComputerImageComponent>
        </SectionComponent>
        <SectionComponent
          styles={{
            flex: 1,
            flexDirection: 'row',
            // width: screenWidth - 40,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ComputerImageComponent
            styles={{
              borderRadius: 12,
              paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
              paddingVertical: 12,
              backgroundColor: 'rgba(106, 248, 253, 0.3)',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  padding: 2,
                  borderRadius: 10,
                }}
                color="gray"
                size={18}
                text="Computer 3"
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer3 === 1}
                onValueChange={value => handleSwitchChange('computer3', value)}
              />
            </View>
          </ComputerImageComponent>
          <ComputerImageComponent
            styles={{
              borderRadius: 12,
              paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
              paddingVertical: 12,
              backgroundColor: 'rgba(106, 248, 253, 0.3)',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  padding: 2,
                  borderRadius: 10,
                }}
                color="gray"
                size={18}
                text="Computer 4"
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer4 === 1}
                onValueChange={value => handleSwitchChange('computer4', value)}
              />
            </View>
          </ComputerImageComponent>
        </SectionComponent>

        {/* <SectionComponent styles={{flex: 1, flexDirection: 'row'}}>
          <View
            style={[
              globalStyles.inputContainer,
              {
                flex: 1,
                width: screenWidth - 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                backgroundColor: '#5F7990',
              },
            ]}>
            <TextComponent text="Computer 1" />
            <SwitchComponent
              showConfirmationDialog={true}
              styles={{paddingVertical: 8}}
              value={computerStatuses.computer1 === 1}
              onValueChange={value => handleSwitchChange('computer1', value)}
            />
          </View>
          <View
            style={[
              globalStyles.inputContainer,
              {
                flex: 1,
                width: screenWidth - 40,
                backgroundColor: '#5F7990',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <TextComponent text="Computer 2" />
            <SwitchComponent
              showConfirmationDialog={true}
              styles={{paddingVertical: 8}}
              value={computerStatuses.computer2 === 1}
              onValueChange={value => handleSwitchChange('computer2', value)}
            />
          </View>
        </SectionComponent>
        <SectionComponent styles={{flex: 1, flexDirection: 'row'}}>
          <View
            style={[
              globalStyles.inputContainer,
              {
                flex: 1,
                width: screenWidth - 40,
                backgroundColor: '#5F7990',
                justifyContent: 'center',
                alignItems: 'center',

                marginRight: 10,
              },
            ]}>
            <TextComponent text="Computer 3" />
            <SwitchComponent
              showConfirmationDialog={true}
              styles={{paddingVertical: 8}}
              value={computerStatuses.computer3 === 1}
              onValueChange={value => handleSwitchChange('computer3', value)}
            />
          </View>
          <View
            style={[
              globalStyles.inputContainer,
              {
                flex: 1,
                width: screenWidth - 40,
                backgroundColor: '#5F7990',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <TextComponent text="Computer 4" />
            <SwitchComponent
              showConfirmationDialog={true}
              styles={{paddingVertical: 8}}
              value={computerStatuses.computer4 === 1}
              onValueChange={value => handleSwitchChange('computer4', value)}
            />
          </View>
        </SectionComponent> */}
        <SectionComponent styles={{flex: 1, flexDirection: 'row'}}>
          <View
            style={[
              globalStyles.inputContainer,
              {
                flex: 1,
                width: screenWidth - 40,
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 2,
              },
            ]}>
            <TextComponent
              styles={{fontWeight: 'bold', fontSize: 15, color: '#9A7FFE'}}
              text="Lượng điện tiêu thụ"
            />
            <TextComponent
              styles={{marginLeft: 2, color: 'gray'}}
              text="Lượng điện tiêu thụ hàng ngày: 10 kWh"
            />
            <TextComponent
              styles={{marginLeft: 2, color: 'gray'}}
              text="Lượng điện tiêu thụ hàng tuần: 70 kWh"
            />
            <TextComponent
              styles={{marginLeft: 2, color: 'gray'}}
              text="Lượng điện tiêu thụ hàng tháng: 210 kWh"
            />
          </View>
        </SectionComponent>
        {/* <SectionComponent styles={{flex: 1, flexDirection: 'row'}}>
          <View
            style={[
              globalStyles.inputContainer,
              {
                flex: 1,
                width: screenWidth - 40,
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 2,
              },
            ]}></View>
        </SectionComponent>
        <SectionComponent>
          <RowComponent
            styles={[globalStyles.inputContainer]}
            onPress={() => navigation.navigate('SearchScreen')}>
            <TextComponent color="#696B6F" text="Search task" />
            <SearchNormal1 size={20} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent>
            <RowComponent>
              <View style={{flex: 1}}>
                <TitleComponent text="Task progress" />
                <TextComponent text="30/40 tasks done" />
                <SpaceComponent height={12} />
                <RowComponent justify="flex-start">
                  <TagComponent
                    text="Match 22"
                    onPress={() => console.log('Say Hi!!!')}
                  />
                </RowComponent>
              </View>
              <View>
                <CicularComponent value={80} />
              </View>
            </RowComponent>
          </CardComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent styles={{alignItems: 'flex-start'}}>
            <View style={{flex: 1}}>
              <CardImageConponent>
                <TouchableOpacity
                  onPress={() => {}}
                  style={globalStyles.iconContainer}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                <TitleComponent text="UX Design" />
                <TextComponent text="Task management mobile app" size={13} />

                <View style={{marginVertical: 28}}>
                  <AvatarGroup />
                  <ProgressBarComponent
                    percent="70%"
                    color="#0AACFF"
                    size="large"
                  />
                </View>
                <TextComponent
                  text="Due, 2023 Match 03"
                  size={12}
                  color={colors.desc}
                />
              </CardImageConponent>
            </View>
            <SpaceComponent width={16} />
            <View style={{flex: 1}}>
              <CardImageConponent color="rgba(33, 150, 243, 0.9)">
                <TouchableOpacity
                  onPress={() => {}}
                  style={globalStyles.iconContainer}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                <TitleComponent text="API Payment" size={18} />
                <AvatarGroup />
                <ProgressBarComponent percent="40%" color="#A2F068" />
              </CardImageConponent>

              <SpaceComponent height={16} />
              <CardImageConponent color="rgba(18, 181, 22, 0.9)">
                <TouchableOpacity
                  onPress={() => {}}
                  style={globalStyles.iconContainer}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                <TitleComponent text="Update work" />
                <TextComponent text="Revision home page" size={13} />
              </CardImageConponent>
            </View>
          </RowComponent>
        </SectionComponent> */}
        {/* <SectionComponent>
          <TextComponent
            flex={1}
            font={fontFamilies.bold}
            size={21}
            text="Urgents tasks"
          />
          <CardComponent>
            <RowComponent>
              <CicularComponent value={40} radius={36} />
              <View
                style={{flex: 1, justifyContent: 'center', paddingLeft: 12}}>
                <TextComponent text="Title of task" />
              </View>
            </RowComponent>
          </CardComponent>
        </SectionComponent> */}
      </Container>
    </View>
  );
};

export default HomeScreen;
