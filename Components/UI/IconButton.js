import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'

function IconButton({ color, size, onPressed, icon }) {
    <View>
        <Pressable style={styles.pressed}>
            <Ionicons name={icon} size={size} color={color} onPress={onPressed} />
        </Pressable>
    </View>
}

export default IconButton;

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.75,
    },
})