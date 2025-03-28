import { StyleSheet, Text, View } from "react-native";

function RecommendedCard({ trimester, focus, exercises }) {
    return (
        <View style={styles.cardContainer}>
            <Text style={styles.trimester}>{trimester}</Text>
            <Text style={styles.focus}>{focus}</Text>
            <View style={styles.exerciseList}>
                {exercises.map((exercise, index) => (
                    <Text key={index} style={styles.exercise}>
                        • {exercise.name} - {exercise.description}
                    </Text>
                ))}
            </View>
        </View>
    );
}

export default RecommendedCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: 300,
        padding: 10,
        backgroundColor: "white",
        elevation: 4,
        borderRadius: 10,
        marginBottom: 10,
        marginVertical: 8,  // Adds spacing between cards
    },
    trimester: {
        fontSize: 16,
        fontWeight: "bold",
    },
    focus: {
        fontSize: 14,
        fontStyle: "italic",
        marginBottom: 5,
    },
    exerciseList: {
        marginTop: 5,
    },
    exercise: {
        fontSize: 12,
        color: "#555",
    },
});
