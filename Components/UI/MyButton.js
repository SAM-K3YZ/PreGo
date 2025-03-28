import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalColor } from "../../constants/style";

function MyButton({ onPressed, mode, children, style }) {
    return (
        <View style={style}>
            <Pressable
                onPress={onPressed}
                style={(pressed) => pressed && styles.pressed}
                android_ripple={true}
            >
                <View
                    style={[styles.button, mode === 'flat' && styles.flat]}
                >
                    <Text
                        style={[style, mode === 'flat' && styles.flatText]}
                    >
                        {children}
                    </Text>
                </View>
            </Pressable>
        </View>
    )
}

export default MyButton;

const styles = StyleSheet.create({
    button: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
        alignItems: 'center',
    },
    flat: {
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.75,
    },
    flatText: {
        color: GlobalColor.lightColors.primary,
    },
    mode: {
        backgroundColor: 'transparent',
    }
})