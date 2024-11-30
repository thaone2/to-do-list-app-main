import database from '@react-native-firebase/database';
import {Calendar, Clock} from 'iconsax-react-native';
import moment from 'moment';
import 'moment/locale/vi'; // Để hiển thị thứ bằng tiếng Việt
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ImageBackground, Platform, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CardImageConponent from '../../components/CardImageConponent';
import ComputerImageComponent from '../../components/ComputerImageComponent';
import ComputerStatusCardProps from '../../components/ComputerStatusCardProps';
import Container from '../../components/Container';
import SectionComponent from '../../components/SectionComponent';
import SwitchComponent from '../../components/SwitchComponent';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const HomeScreen = ({navigation}: any) => {
  const screenWidth = Dimensions.get('window').width;
  const timeRef = useRef(moment().format('HH:mm:ss'));
  const dateRef = useRef(moment().format('dddd, DD-MM-YYYY'));

  const [time, setTime] = useState(timeRef.current);
  const [date, setDate] = useState(dateRef.current);

  const hlkRadarValueRef = useRef(0);
  const [hlkRadarValue, setHlkRadarValue] = useState(false);

  const computer1Temp = useRef(0);
  const computer2Temp = useRef(0);
  const computer3Temp = useRef(0);
  const computer4Temp = useRef(0);

  const [computerStatuses, setComputerStatuses] = useState({
    computer1: 0,
    computer2: 0,
    computer3: 0,
    computer4: 0,
  });

  const [isAuto, setIsAuto] = useState(0);

  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  const voltageRef = useRef(0);
  const currentRef = useRef(0);
  const frequencyRef = useRef(0);
  const energyRef = useRef(0);

  // useEffect sensor Pzem
  useEffect(() => {
    const voltageRefPath = database().ref('/PZEM_Voltage/voltage');
    const currentRefPath = database().ref('/PZEM_Voltage/current');
    const frequencyRefPath = database().ref('/PZEM_Voltage/frequency');
    const energyRefPath = database().ref('/PZEM_Voltage/energy');

    const handleVoltageUpdate = (snapshot: {val: () => number}) => {
      voltageRef.current = parseFloat(snapshot.val().toFixed(2));
    };

    const handleCurrentUpdate = (snapshot: {val: () => number}) => {
      currentRef.current = parseFloat(snapshot.val().toFixed(2));
    };

    const handleFrequencyUpdate = (snapshot: {val: () => number}) => {
      frequencyRef.current = parseFloat(snapshot.val().toFixed(2));
    };
    const handleEnergyUpdate = (snapshot: {val: () => number}) => {
      energyRef.current = parseFloat(snapshot.val().toFixed(2));
    };

    voltageRefPath.on('value', handleVoltageUpdate);
    currentRefPath.on('value', handleCurrentUpdate);
    frequencyRefPath.on('value', handleFrequencyUpdate);
    energyRefPath.on('value', handleEnergyUpdate);

    // Cleanup function
    return () => {
      voltageRefPath.off('value', handleVoltageUpdate);
      currentRefPath.off('value', handleCurrentUpdate);
      frequencyRefPath.off('value', handleFrequencyUpdate);
      energyRefPath.off('value', handleEnergyUpdate);
    };
  }, []);

  //useEffect sensor hlk radar
  useEffect(() => {
    const databaseHLKRef = database().ref('HLK_RADAR/status');

    const listener = databaseHLKRef.on('value', snapshot => {
      const status = snapshot.val();
      hlkRadarValueRef.current = status;
      setHlkRadarValue(prev => !prev); // Trigger một lần re-render khi giá trị thay đổi
    });
    //cleanup function
    return () => {
      databaseHLKRef.off('value', listener);
    };
  }, []);

  //useEffect nhiệt độ
  useEffect(() => {
    const temperatureRef = database().ref('Temperatures');

    const onTemperatureChange = temperatureRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setLastUpdateTime(new Date().toLocaleString()); // Cập nhật thời gian lấy dữ liệu
        computer1Temp.current = data.computer1.temperature || 0;
        computer2Temp.current = data.computer2.temperature || 0;
        computer3Temp.current = data.computer3.temperature || 0;
        computer4Temp.current = data.computer4.temperature || 0;
      }
    });

    // Cleanup function
    return () => {
      temperatureRef.off('value', onTemperatureChange);
    };
  }, []);

  // useEffect Ngay thang
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

  //useEffect cập nhật lại dữ liệu cuối cùng của computer
  const latestRef = database().ref('Computer');
  useEffect(() => {
    const fetchLastUpdateTime = async () => {
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

  // Fetch `isAuto` status from `/isAuto/status`
  useEffect(() => {
    const isAutoRef = database().ref('isAuto/status');
    const listener = isAutoRef.on('value', snapshot => {
      const status = snapshot.val();
      setIsAuto(status);
    });

    return () => {
      isAutoRef.off('value', listener);
    };
  }, []);

  // Fetch computer statuses from `/Computer/{time_key}`
  useEffect(() => {
    if (!lastUpdateTime) return;

    // const computerRef = database().ref(`Computer/${lastUpdateTime}`);
    const computerRef = database().ref(`Computer`);

    const listener = computerRef.on('value', snapshot => {
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

    return () => {
      computerRef.off('value', listener);
    };
  }, [lastUpdateTime]);

  // Handle switch change for auto/manual (isAuto)
  const handleAutoManualChange = (newValue: any) => {
    const newStatus = newValue ? 1 : 0;
    setIsAuto(newStatus);
    // Update `isAuto/status` in Firebase
    database()
      .ref('isAuto/status')
      .set(newStatus)
      .then(() => console.log('Auto/Manual status updated'))
      .catch(error =>
        console.error('Failed to update auto/manual status:', error),
      );
  };
  // Handle switch change for computers
  const handleSwitchChange = (computerId: any, newValue: any) => {
    const newStatus = {
      ...computerStatuses,
      [computerId]: newValue ? 1 : 0,
    };
    setComputerStatuses(newStatus);

    const currentTimeKey = moment().format('YYYY-MM-DD HH:mm:ss');

    // Update computer status in `/Computer/{currentTimeKey}`
    const firebaseStatus = {
      computer1: {status: newStatus.computer1},
      computer2: {status: newStatus.computer2},
      computer3: {status: newStatus.computer3},
      computer4: {status: newStatus.computer4},
    };
    database()
      .ref(`Computer`)
      .set(firebaseStatus)
      .then(() => setLastUpdateTime(currentTimeKey))
      .catch(error =>
        console.error(`Failed to update ${computerId} status:`, error),
      );
  };

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        {/* Đồng hồ */}
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

            <CardImageConponent styles={{}} color="rgba(128, 128, 128, 0.5)">
              <Clock size="32" color="#FF8A65" />
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
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

        {/* HLK Radar */}
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
                  color: 'black',
                  fontWeight: 'bold',
                  paddingTop: 6,
                }}
                text="HLK Radar Sensor"
                size={18}
              />
              <TextComponent
                color="black"
                size={16}
                text="Trạng thái cảm biến"
                styles={{
                  fontWeight: '600',
                  paddingHorizontal: 2,
                }}
              />

              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                  backgroundColor:
                    hlkRadarValueRef.current === 1 ? '#5DF15A' : '#FF6347',
                  marginTop: 4,
                }}
              />
              <View
                style={{
                  marginTop: 6,
                  backgroundColor: 'rgba(226, 238, 240, 1)',
                  paddingVertical: 2,
                  paddingHorizontal: 2,
                  borderRadius: 12,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  marginHorizontal:
                    hlkRadarValueRef.current === 1 ? '20%' : '16%',
                }}>
                {hlkRadarValueRef.current === 1 ? (
                  <>
                    <Icon
                      name="done"
                      size={25}
                      color="#5DF15A"
                      style={{marginLeft: 2}}
                    />
                    <TextComponent
                      text="Có người trong phòng"
                      color="#5DF15A"
                      size={15}
                      styles={{
                        marginLeft: -4,
                        textAlign: 'center',
                        paddingRight: 1,
                        fontWeight: '700',
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Icon
                      name="close"
                      size={25}
                      color="#FF6347"
                      style={{marginLeft: 2, textAlign: 'center'}}
                    />
                    <TextComponent
                      text="Không có người trong phòng"
                      color="#FF6347"
                      size={14}
                      styles={{
                        marginLeft: -4,
                        textAlign: 'center',
                        paddingRight: 1,
                        fontWeight: '700',
                      }}
                    />
                  </>
                )}
              </View>
            </View>
          </ImageBackground>
        </SectionComponent>

        {/*Auto manual computer */}
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
                size={17}
                text="Auto / Manual control PC"
              />
              <SwitchComponent
                showConfirmationDialog={true}
                styles={{paddingVertical: 8}}
                // value={computerStatuses.autoManual === 1}
                value={isAuto === 1}
                // onValueChange={value => handleSwitchChange('autoManual', value)}
                onValueChange={handleAutoManualChange}
              />
            </View>
          </ComputerImageComponent>
        </SectionComponent>

        {/* computer 1 2 */}
        <SectionComponent
          styles={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ComputerStatusCardProps
            isAuto={isAuto === 1}
            computerName="Computer 1"
            temperature={computer1Temp.current}
            switchValue={computerStatuses.computer1 === 1}
            onSwitchChange={value => handleSwitchChange('computer1', value)}
          />
          <ComputerStatusCardProps
            isAuto={isAuto === 1}
            computerName="Computer 2"
            temperature={computer2Temp.current}
            switchValue={computerStatuses.computer2 === 1}
            onSwitchChange={value => handleSwitchChange('computer2', value)}
          />
        </SectionComponent>

        {/* computer 3 4 */}
        <SectionComponent
          styles={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ComputerStatusCardProps
            isAuto={isAuto === 1}
            computerName="Computer 3"
            temperature={computer3Temp.current}
            switchValue={computerStatuses.computer3 === 1}
            onSwitchChange={value => handleSwitchChange('computer3', value)}
          />
          <ComputerStatusCardProps
            isAuto={isAuto === 1}
            computerName="Computer 4"
            temperature={computer4Temp.current}
            switchValue={computerStatuses.computer4 === 1}
            onSwitchChange={value => handleSwitchChange('computer4', value)}
          />
        </SectionComponent>

        {/* Pzem */}
        <SectionComponent>
          <View style={[globalStyles.inputContainer]}>
            <View
              style={[
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                },
              ]}>
              <TextComponent
                text="PZEM004T Sensor"
                color="black"
                size={17}
                styles={{fontWeight: 'bold'}}
              />
            </View>
            <View
              style={[
                {
                  alignItems: 'flex-start',
                  flex: 1,
                  paddingVertical: 4,
                },
              ]}>
              <TextComponent
                text={`Voltage: ${voltageRef.current} V`}
                color="blue"
                size={17}
                styles={{fontWeight: 'normal', marginLeft: 8}}
              />
              <TextComponent
                text={`Frequency: ${frequencyRef.current} Hz`}
                color="green"
                size={17}
                styles={{fontWeight: 'normal', marginLeft: 10}}
              />
              <TextComponent
                text={`Current: ${currentRef.current} A`}
                color="#444444"
                size={17}
                styles={{fontWeight: 'normal', marginLeft: 10}}
              />
              <TextComponent
                text={`Energy: ${energyRef.current} kWh`}
                color="purple"
                size={17}
                styles={{fontWeight: 'normal', marginLeft: 10}}
              />
            </View>
          </View>
        </SectionComponent>
      </Container>
    </View>
  );
};

export default HomeScreen;
