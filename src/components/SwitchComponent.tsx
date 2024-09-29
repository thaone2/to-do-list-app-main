// import React, {useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Alert,
// } from 'react-native';

// interface SwitchComponentProps {
//   showConfirmationDialog?: boolean;
// }

// const SwitchComponent: React.FC<SwitchComponentProps> = ({
//   showConfirmationDialog = false, // Default value is false
// }) => {
//   const [isEnabled, setIsEnabled] = useState(false);
//   const translateX = useRef(new Animated.Value(0)).current; // Starting position of the knob

//   // Function to toggle the switch with animation
//   const animateSwitch = (newState: boolean) => {
//     Animated.timing(translateX, {
//       toValue: newState ? 28 : 0, // Move to 0 or 28 based on state
//       duration: 150, // Smooth transition duration (250ms)
//       useNativeDriver: true,
//     }).start();

//     setIsEnabled(newState);
//   };

//   // Function to show confirmation dialog
//   const handlePress = () => {
//     if (showConfirmationDialog) {
//       if (isEnabled) {
//         // Dialog when the switch is ON
//         Alert.alert('Xác nhận', 'Bạn có thật sự muốn tắt không?', [
//           {text: 'Hủy', style: 'cancel'},
//           {text: 'Đồng ý', onPress: () => animateSwitch(false)},
//         ]);
//       } else {
//         // Dialog when the switch is OFF
//         Alert.alert('Xác nhận', 'Bạn có muốn bật không?', [
//           {text: 'Hủy', style: 'cancel'},
//           {text: 'Đồng ý', onPress: () => animateSwitch(true)},
//         ]);
//       }
//     } else {
//       // Directly toggle the switch without confirmation
//       animateSwitch(!isEnabled);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[
//           styles.switch,
//           {backgroundColor: isEnabled ? '#5BF842' : '#B8C1B6'},
//         ]}
//         onPress={handlePress}>
//         <Animated.View
//           style={[
//             styles.knob,
//             {transform: [{translateX: translateX}]}, // Apply animated translation
//           ]}
//         />
//       </TouchableOpacity>
//       {/* <Text style={styles.label}>
//         {isEnabled ? 'Switch is ON' : 'Switch is OFF'}
//       </Text> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   switch: {
//     width: 60,
//     height: 34,
//     borderRadius: 34,
//     justifyContent: 'center',
//     paddingHorizontal: 0,
//   },
//   knob: {
//     width: 34,
//     height: 34,
//     borderRadius: 34 / 2,
//     backgroundColor: 'white',
//     position: 'absolute',
//     // bottom: 0,
//   },
//   //   label: {
//   //     marginTop: 10,
//   //     fontSize: 16,
//   //     color: '#000',
//   //   },
// });

// export default SwitchComponent;

import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface Props {
  showConfirmationDialog?: boolean;
  styles?: StyleProp<ViewStyle>; // Custom styles prop
}

const SwitchComponent: React.FC<Props> = ({
  showConfirmationDialog = false,
  styles,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current; // Starting position of the knob

  // Function to toggle the switch with animation
  const animateSwitch = (newState: boolean) => {
    Animated.timing(translateX, {
      toValue: newState ? 28 : 0, // Move to 0 or 28 based on state
      duration: 150, // Smooth transition duration (150ms)
      useNativeDriver: true,
    }).start();

    setIsEnabled(newState);
  };

  // Function to show confirmation dialog
  const handlePress = () => {
    if (showConfirmationDialog) {
      if (isEnabled) {
        // Dialog when the switch is ON
        Alert.alert('Xác nhận', 'Bạn có thật sự muốn tắt không?', [
          {text: 'Hủy', style: 'cancel'},
          {text: 'Đồng ý', onPress: () => animateSwitch(false)},
        ]);
      } else {
        // Dialog when the switch is OFF
        Alert.alert('Xác nhận', 'Bạn có muốn bật không?', [
          {text: 'Hủy', style: 'cancel'},
          {text: 'Đồng ý', onPress: () => animateSwitch(true)},
        ]);
      }
    } else {
      // Directly toggle the switch without confirmation
      animateSwitch(!isEnabled);
    }
  };

  return (
    <View style={[defaultStyles.container, styles]}>
      <TouchableOpacity
        style={[
          defaultStyles.switch,
          {backgroundColor: isEnabled ? '#5BF842' : '#B8C1B6'},
        ]}
        onPress={handlePress}>
        <Animated.View
          style={[
            defaultStyles.knob,
            {transform: [{translateX: translateX}]}, // Apply animated translation
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    width: 60,
    height: 34,
    borderRadius: 34,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  knob: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: 'white',
    position: 'absolute',
  },
});

export default SwitchComponent;
