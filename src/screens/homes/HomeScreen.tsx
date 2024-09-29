import {
  Add,
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal1,
} from 'iconsax-react-native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
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

const HomeScreen = ({navigation}: any) => {
  const handleSingout = async () => {
    await auth().signOut();
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{flex: 1}}>
      <SectionComponent
        styles={{
          paddingVertical: 23,
          backgroundColor: colors.bgColor,
          marginTop: 0,
          marginBottom: -30,
        }}>
        <RowComponent>
          <View
            style={{
              flex: 1,
            }}>
            <TextComponent
              styles={{fontWeight: 'bold', fontSize: 20}}
              text="HomeScreen"
            />
          </View>
          <TouchableOpacity onPress={handleSingout}>
            <Logout size={30} color="coral" />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent>
      <Container isScroll>
        {/* <SectionComponent>
          <RowComponent justify="space-between">
            <Element4 size={24} color={colors.desc} />
            <Notification size={24} color={colors.desc} /> 
          </RowComponent>
        </SectionComponent> */}
        {/* <SectionComponent>
          <RowComponent>
            <View
              style={{
                flex: 1,
              }}>
              <TextComponent
                styles={{fontWeight: 'bold', fontSize: 18}}
                text="HomeScreen"
              />
            </View>
            <TouchableOpacity onPress={handleSingout}>
              <Logout size={22} color="coral" />
            </TouchableOpacity>
          </RowComponent>
        </SectionComponent> */}

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
              },
            ]}>
            <TextComponent
              styles={[
                {
                  color: '#26F2CD',
                  fontWeight: 'bold',
                },
              ]}
              text="HLK Radar Sensor"
            />
            <TextComponent text="Trạng thái cảm biến" />

            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                backgroundColor: '#5DF15A',
                marginTop: 4,
              }}></View>
          </View>
        </SectionComponent>

        <SectionComponent styles={{flex: 1, flexDirection: 'row'}}>
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
              styles={{marginLeft: 2}}
              text="Lượng điện tiêu thụ hàng ngày: 10 kWh"
            />
            <TextComponent
              styles={{marginLeft: 2}}
              text="Lượng điện tiêu thụ hàng tuần: 70 kWh"
            />
            <TextComponent
              styles={{marginLeft: 2}}
              text="Lượng điện tiêu thụ hàng tháng: 210 kWh"
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
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 2,
              },
            ]}>
            {/* <SwitchComponent
              styles={{
                // transform: [{scaleX: 2}, {scaleY: 2}],
                paddingVertical: 20,
              }}
            />
            <SwitchComponent showConfirmationDialog={true} /> */}
          </View>
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

        {/* <SectionComponent>
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
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('AddNewTask')}
          style={[
            globalStyles.row,
            {
              backgroundColor: colors.blue,
              padding: 10,
              borderRadius: 12,
              paddingVertical: 14,
              width: '80%',
            },
          ]}>
          <TextComponent text="Add new tasks" flex={0} />
          <Add size={22} color={colors.white} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default HomeScreen;
