import database from '@react-native-firebase/database';
import {Calendar, Clock} from 'iconsax-react-native';
import moment from 'moment';
import 'moment/locale/vi'; // Để hiển thị thứ bằng tiếng Việt
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ImageBackground, Platform, View} from 'react-native';

import CardImageConponent from '../../components/CardImageConponent';
import ComputerImageComponent from '../../components/ComputerImageComponent';
import Container from '../../components/Container';
import SectionComponent from '../../components/SectionComponent';
import SwitchComponent from '../../components/SwitchComponent';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const HomeScreen = ({navigation}: any) => {
  // const handleSingout = async () => {
  //   await auth().signOut();
  // };

  const screenWidth = Dimensions.get('window').width;
  const timeRef = useRef(moment().format('HH:mm:ss'));
  const dateRef = useRef(moment().format('dddd, DD-MM-YYYY')); // Hiển thị thứ

  const [time, setTime] = useState(timeRef.current);
  const [date, setDate] = useState(dateRef.current);

  const hlkRadarValueRef = useRef(0);
  const [hlkRadarValue, setHlkRadarValue] = useState(false);

  //useEff của hlk radar
  useEffect(() => {
    const databaseHLKRef = database().ref('HLK_RADAR/status');

    const listener = databaseHLKRef.on('value', snapshot => {
      const status = snapshot.val();
      hlkRadarValueRef.current = status;
      setHlkRadarValue(prev => !prev); // Trigger một lần re-render khi giá trị thay đổi
    });

    return () => {
      databaseHLKRef.off('value', listener); // Dọn dẹp listener khi component bị unmount
    };
  }, []);

  const computer1Temp = useRef(0);
  const computer2Temp = useRef(0);
  const computer3Temp = useRef(0);
  const computer4Temp = useRef(0);

  // const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastTemperatureData = async () => {
      const temperatureRef = database().ref('Temperatures');
      const snapshot = await temperatureRef
        .orderByKey()
        .limitToLast(1)
        .once('value');
      const data = snapshot.val();

      if (data) {
        const lastKey = Object.keys(data)[0]; // Lấy thời gian cập nhật cuối cùng
        setLastUpdateTime(lastKey);

        const latestData = data[lastKey];
        if (latestData) {
          computer1Temp.current = latestData.computer1.temperature || 0;
          computer2Temp.current = latestData.computer2.temperature || 0;
          computer3Temp.current = latestData.computer3.temperature || 0;
          computer4Temp.current = latestData.computer4.temperature || 0;
        }
      }
    };

    fetchLastTemperatureData();
  }, []);

  //useEffect cập nhật lại dữ liệu cuối củng của computer
  const latestRef = database().ref('Computer');
  useEffect(() => {
    const fetchLastUpdateTime = async () => {
      // const latestRef = database().ref('Computer'); // Đường dẫn tới dữ liệu máy tính
      const snapshot = await latestRef
        .orderByKey()
        .limitToLast(1)
        .once('value');
      const data = snapshot.val();

      if (data) {
        const lastKey = Object.keys(data)[0];
        setLastUpdateTime(lastKey);
      }
    };

    fetchLastUpdateTime();
  }, [latestRef]);

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

  const [computerStatuses, setComputerStatuses] = useState({
    autoManual: 0,
    computer1: 0,
    computer2: 0,
    computer3: 0,
    computer4: 0,
  });
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (!lastUpdateTime) return;

    const databaseRef = database().ref(`Computer/${lastUpdateTime}`);
    const listener = databaseRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setComputerStatuses({
          autoManual: data.autoManual?.status || 0,
          computer1: data.computer1?.status || 0,
          computer2: data.computer2?.status || 0,
          computer3: data.computer3?.status || 0,
          computer4: data.computer4?.status || 0,
        });
      }
    });

    return () => {
      databaseRef.off('value', listener);
    };
  }, [lastUpdateTime]);

  const handleSwitchChange = (computerId: any, newValue: any) => {
    const newStatus = {
      ...computerStatuses,
      [computerId]: newValue ? 1 : 0,
    };

    setComputerStatuses(newStatus);

    const currentTimeKey = getCurrentDateTime();

    const firebaseStatus = {
      autoManual: {status: newStatus.autoManual},
      computer1: {status: newStatus.computer1},
      computer2: {status: newStatus.computer2},
      computer3: {status: newStatus.computer3},
      computer4: {status: newStatus.computer4},
    };

    database()
      .ref(`Computer/${currentTimeKey}`)
      .set(firebaseStatus)
      .then(() => {
        setLastUpdateTime(currentTimeKey);
        console.log(
          `Status of ${computerId} updated successfully at ${currentTimeKey}.`,
        );
      })
      .catch((error: any) => {
        console.error(`Failed to update ${computerId} status:`, error);
      });
  };

  return (
    <View style={{flex: 1}}>
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
                  size={16}
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
                  alignItems: 'flex-start',
                  // padding: 2,
                  paddingVertical: 10,
                  marginHorizontal: 6,
                  width: 65,
                }}>
                <TextComponent
                  color="white"
                  font="semiBold"
                  size={14}
                  text={time}
                  styles={{fontWeight: 'bold'}}
                />
              </View>
            </CardImageConponent>
          </View>
        </SectionComponent>

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
                  backgroundColor:
                    hlkRadarValueRef.current === 1 ? '#5DF15A' : '#FF6347',
                  marginTop: 4,
                }}
              />

              <TextComponent
                color={hlkRadarValueRef.current === 1 ? '#5DF15A' : '#FF6347'}
                size={20}
                text={
                  hlkRadarValueRef.current === 1
                    ? '✅ Có người trong phòng'
                    : '❌ Không có người trong phòng'
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ComputerImageComponent
            styles={{
              borderRadius: 12,
              paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
              // paddingVertical: 12,
              backgroundColor: 'rgba(106, 248, 253, 0.3)',
              width: screenWidth - 40,
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
                  padding: 6,
                  borderRadius: 10,
                }}
                color="gray"
                size={18}
                text="Auto / Manual control PC"
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.autoManual === 1}
                onValueChange={value => handleSwitchChange('autoManual', value)}
              />
            </View>
          </ComputerImageComponent>
        </SectionComponent>

        <SectionComponent
          styles={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ComputerImageComponent
            disable={computerStatuses.autoManual === 1}
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
                size={16}
                text="Computer 1"
              />
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  // padding: 2,
                  borderRadius: 10,
                  // paddingHorizontal: 6,
                  marginTop: 4,
                }}
                color="#F8C266"
                size={13}
                text={`Temp:  ${computer1Temp.current} ℃`}
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer1 === 1}
                onValueChange={value => handleSwitchChange('computer1', value)}
                disabled={computerStatuses.autoManual === 1}
              />
            </View>
          </ComputerImageComponent>
          <ComputerImageComponent
            disable={computerStatuses.autoManual === 1}
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
                size={16}
                text="Computer 2"
              />
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  // padding: 2,
                  borderRadius: 10,
                  // paddingHorizontal: 6,
                  marginTop: 4,
                }}
                color="#F8C266"
                size={13}
                text={`Temp:  ${computer2Temp.current} ℃`}
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer2 === 1}
                onValueChange={value => handleSwitchChange('computer2', value)}
                disabled={computerStatuses.autoManual === 1}
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
            disable={computerStatuses.autoManual === 1}
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
                size={16}
                text="Computer 3"
              />
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  // padding: 2,
                  borderRadius: 10,
                  // paddingHorizontal: 6,
                  marginTop: 4,
                }}
                color="#F8C266"
                size={13}
                text={`Temp:  ${computer3Temp.current} ℃`}
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer3 === 1}
                onValueChange={value => handleSwitchChange('computer3', value)}
                disabled={computerStatuses.autoManual === 1}
              />
            </View>
          </ComputerImageComponent>
          <ComputerImageComponent
            disable={computerStatuses.autoManual === 1}
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
                size={16}
                text="Computer 4"
              />
              <TextComponent
                styles={{
                  fontWeight: 'bold',
                  backgroundColor: '#F2EAEA',
                  // padding: 2,
                  borderRadius: 10,
                  // paddingHorizontal: 6,
                  marginTop: 4,
                }}
                color="#F8C266"
                size={13}
                text={`Temp:  ${computer4Temp.current} ℃`}
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                value={computerStatuses.computer4 === 1}
                onValueChange={value => handleSwitchChange('computer4', value)}
                disabled={computerStatuses.autoManual === 1}
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

        {/* Lượng điện tiêu thụ */}
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
        </SectionComponent> */}

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
