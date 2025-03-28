import { FlatList, StyleSheet, Text, View } from "react-native";
import RecommendedCard from "../UI/recommendedCard";
import { exerciseData } from "../../constants/data";

function renderExerciseItem({ item }) {
    console.log("Rendering item:", item); // Debugging
    return <RecommendedCard {...item} />;
}

function RecommendedExerciseList() {

    //console.log(exerciseData); // Debugging: Check if the data exists

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommended Exercises</Text>
            <FlatList
                data={exerciseData}
                renderItem={renderExerciseItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

export default RecommendedExerciseList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
