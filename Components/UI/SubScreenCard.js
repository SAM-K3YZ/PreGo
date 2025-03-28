import { Image, StyleSheet, Text, View } from "react-native";
import MyButton from "./MyButton";
import { GlobalColor } from "../../constants/style";

function SubScreenCard({ style, title, subtitle, img, btn, btnBg }) {
    return (
        <View style={[style, styles.cardContainer]}>
            <View style={styles.imageContainer}>
                <Image style={styles.imageStyle} source={img} />
            </View>

            <View style={[styles.textArea]}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubTitle}>{subtitle}</Text>

                <View style={[btnBg, styles.buttonContainer]}>
                    <MyButton style={styles.button} children={btn} />
                </View>
                {/* <Button style={style} title={String(btn)} /> */}
            </View>
        </View>
    )
}

export default SubScreenCard;

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        width: 120,
        // backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: ' 100%',
        height: '100%',
    },
    textArea: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardSubTitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    buttonContainer: {
        // color: GlobalColor.darkColors.accentBlue,
        width: 125,
        height: 40,
        padding: 10,
        borderRadius: 20,
        marginTop: 15,
        opacity: 0.70
    },
    button: {
        fontSize: 14,
        fontWeight: '500',
    }
});