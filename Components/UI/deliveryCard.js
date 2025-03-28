import { StyleSheet, Text, View } from "react-native";

function DeliveryCard({ conceptionDate, deliveryDate, trimester, daysPregnant, style }) {
    return (
        <View style={[styles.cardContainer, style]}>
            <View style={styles.leftSide}>
                <Text style={[styles.text, styles.date]}>Conception Date: {conceptionDate}</Text>
                <Text style={[styles.text, styles.date]}>Delivery Date: {deliveryDate}</Text>
                <Text style={[styles.text]}>Trimester: {trimester}</Text>
                <Text style={styles.text}>Status: {daysPregnant}</Text>
            </View>
           
           
        </View>
    );
}

export default DeliveryCard;

const styles = StyleSheet.create({
    cardContainer: {
        maxWidth: '400',
        height: 150,
        paddingLeft: 20,
        elevation: 4,
        borderRadius: 15,
        backgroundColor: "white",
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row'
    },
    text: {
        fontSize: 14,
        
        color: "black",
        marginBottom: 5,
    },
    date:{
        fontWeight: "bold",
        marginBottom: 10,
    },
});
