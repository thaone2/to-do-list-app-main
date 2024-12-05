import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const MachineLearningScreen = () => {
  return (
    <View style={{flex: 1}}>
      {/* <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '50%',
        }}>
        <ActivityIndicator color="black" size="large" />
        <TextComponent
          color="black"
          text="Đang suy nghĩ ..."
          size={17}
          styles={{textAlign: 'center', marginTop: 10}}
        />
      </View> */}
      <TouchableOpacity style={{marginTop: 50, marginBottom: 20}}>
        <TextComponent
          text="Kiểm tra kết nối server"
          styles={[
            globalStyles.inputContainer,
            {
              flex: 0,
              marginHorizontal: 14,
              textAlign: 'center',
              backgroundColor: '#BFC8BD',
            },
          ]}
          color="black"
          size={16}
        />
      </TouchableOpacity>
      <TextComponent
        text="Trạng thái kết nối: OK"
        styles={{
          color: 'gray',
          flex: 0,
          marginHorizontal: 14,
          textAlign: 'center',
          padding: 10,
        }}
        size={16}
      />
      <TouchableOpacity style={{marginTop: 20}}>
        <TextComponent
          text="Bắt đầu dự đoán"
          styles={[
            globalStyles.inputContainer,
            {
              flex: 0,
              marginHorizontal: 14,
              textAlign: 'center',
              backgroundColor: '#6998FF',
            },
          ]}
          color="white"
          size={16}
        />
      </TouchableOpacity>

      {/* kết quả */}
    </View>
  );
};

export default MachineLearningScreen;
