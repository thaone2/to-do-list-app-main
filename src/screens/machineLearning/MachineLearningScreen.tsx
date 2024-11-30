import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {ListItem} from './ListItem';
import {colors} from '../../constants/colors';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const data = new Array(50).fill(0).map((_, index) => ({id: index}));
// [{id: 0}, {id: 1}, {id: 2}, ..., {id: 49}]

const MachineLearningScreen = () => {
  const viewableItems = useSharedValue<ViewToken[]>([]);
  return (
    <View style={styles.container}>
      {/* <FlatList
        data={data}
        contentContainerStyle={{paddingTop: 40}}
        onViewableItemsChanged={({viewableItems: vItems}) => {
          viewableItems.value = vItems;
        }}
        renderItem={({item}) => {
          return <ListItem item={item} viewableItems={viewableItems} />;
        }}
      /> */}
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
          text="Đang suy nghĩ ..."
          size={17}
          styles={{textAlign: 'center', marginTop: 10}}
        />
      </View>
    </View>
  );
};

export default MachineLearningScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
