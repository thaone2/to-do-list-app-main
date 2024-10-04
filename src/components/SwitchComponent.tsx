// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Alert,
//   StyleProp,
//   ViewStyle,
// } from 'react-native';

// interface Props {
//   showConfirmationDialog?: boolean;
//   styles?: StyleProp<ViewStyle>; // Custom styles prop
//   value: boolean; // Value prop to set initial switch state
//   onValueChange: (newValue: boolean) => void; // Function to handle value change
// }

// const SwitchComponent: React.FC<Props> = ({
//   showConfirmationDialog = false,
//   styles,
//   value,
//   onValueChange,
// }) => {
//   const [isEnabled, setIsEnabled] = useState(value); // Set initial value from props
//   const translateX = useRef(new Animated.Value(value ? 28 : 0)).current; // Starting position of the knob based on value

//   // Function to toggle the switch with animation
//   const animateSwitch = (newState: boolean) => {
//     Animated.timing(translateX, {
//       toValue: newState ? 28 : 0, // Move to 0 or 28 based on state
//       duration: 150, // Smooth transition duration (150ms)
//       useNativeDriver: true,
//     }).start();

//     setIsEnabled(newState);
//     onValueChange(newState); // Notify parent component about the state change
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

//   // Effect to sync external value changes with internal state
//   useEffect(() => {
//     if (value !== isEnabled) {
//       setIsEnabled(value);
//       translateX.setValue(value ? 28 : 0); // Update knob position when value prop changes
//     }
//   }, [value, translateX, isEnabled]);

//   return (
//     <View style={[defaultStyles.container, styles]}>
//       <TouchableOpacity
//         style={[
//           defaultStyles.switch,
//           {backgroundColor: isEnabled ? '#5BF842' : '#B8C1B6'},
//         ]}
//         onPress={handlePress}>
//         <Animated.View
//           style={[
//             defaultStyles.knob,
//             {transform: [{translateX: translateX}]}, // Apply animated translation
//           ]}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const defaultStyles = StyleSheet.create({
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
//   },
// });

// export default SwitchComponent;

import React, {useState, useRef, useEffect} from 'react';
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
  value: boolean; // Value prop to set initial switch state
  onValueChange: (newValue: boolean) => void; // Function to handle value change
  disabled?: boolean; // Disable prop to control if switch is interactive
}

const SwitchComponent: React.FC<Props> = ({
  showConfirmationDialog = false,
  styles,
  value,
  onValueChange,
  disabled = false, // Default disabled to false
}) => {
  const [isEnabled, setIsEnabled] = useState(value); // Set initial value from props
  const translateX = useRef(new Animated.Value(value ? 28 : 0)).current; // Starting position of the knob based on value

  // Function to toggle the switch with animation
  const animateSwitch = (newState: boolean) => {
    Animated.timing(translateX, {
      toValue: newState ? 28 : 0, // Move to 0 or 28 based on state
      duration: 150, // Smooth transition duration (150ms)
      useNativeDriver: true,
    }).start();

    setIsEnabled(newState);
    onValueChange(newState); // Notify parent component about the state change
  };

  // Function to show confirmation dialog
  const handlePress = () => {
    if (disabled) return; // Do nothing if disabled is true

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

  // Effect to sync external value changes with internal state
  useEffect(() => {
    if (value !== isEnabled) {
      setIsEnabled(value);
      translateX.setValue(value ? 28 : 0); // Update knob position when value prop changes
    }
  }, [value, translateX, isEnabled]);

  return (
    <View style={[defaultStyles.container, styles]}>
      <TouchableOpacity
        style={[
          defaultStyles.switch,
          {
            backgroundColor: isEnabled ? '#5BF842' : '#B8C1B6',
            opacity: disabled ? 0.5 : 1,
          }, // Set opacity when disabled
        ]}
        onPress={handlePress}
        activeOpacity={disabled ? 1 : 0.7} // Make unclickable when disabled
      >
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
