import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useContext } from "react";

import DeliveryCard from '../Components/UI/deliveryCard';
import { PregnancyContext } from "../store/PregnancyContext";
import SubScreenCard from "../Components/UI/SubScreenCard";
import { GlobalColor } from "../constants/style";
import { exerciseData, subScreenCards } from '../constants/data'
import RecommendedCard from "../Components/UI/recommendedCard";
import RecommendedExerciseList from "../Components/Output/RecommendedExecersiceList";

function HomeScreen() {
    // Access pregnancy details from Context
    const { pregnancyDetails } = useContext(PregnancyContext);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.helloText}>Hello Exypnos...</Text>
                <DeliveryCard style={styles.deliveryCard}{...pregnancyDetails} />

                <View style={styles.subScreenContainer}>

                    {/* First two cards in a row */}
                    <View style={styles.topCard}>
                        {subScreenCards.slice(0, 2).map((card) => (
                            <SubScreenCard
                                key={card.id}
                                title={card.title}
                                subtitle={card.subtitle}
                                img={card.img}
                                btnBg={{ backgroundColor: card.btnBg }}
                                btn={card.btn}
                                style={{ backgroundColor: card.bgColor }}
                            />
                        ))}
                    </View>

                    {/* Third card below */}
                    <View style={styles.bottomCard}>
                        <SubScreenCard
                            title={subScreenCards[2].title}
                            subtitle={subScreenCards[2].subtitle}
                            img={subScreenCards[2].img}
                            style={[{ backgroundColor: subScreenCards[2].bgColor }, styles.bottomCard]}
                            btn={subScreenCards[2].btn}
                            btnBg={[subScreenCards[2].btnBg, styles.bottomCardBtn]} //bg is design here cause it was seperated
                        />

                    </View>
                </View>

                <View style={styles.recommendedContainer}>
                   <RecommendedExerciseList />
                </View>

            </View >
        </ScrollView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "white",
        marginBottom: 15,
    },
    helloText: {
        fontSize: 14,
        fontWeight: "400",
        color: "black",
        marginTop: 8,
    },
    deliveryCard: {
        marginTop: 25,
    },
    subScreenContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        //backgroundColor: 'red'
    },
    topCard: {
        maxWidth: 190,
        height: 300,
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    bottomCard: {
        width: '100%',
        height: 250,
        marginTop: 10,
        alignItems: "center",
    },
    bottomCardBtn: {
        width: 100,
        height: 40,
        borderRadius: 20,
        marginTop: 15,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    recommendedContainer: {
        alignItems: 'center',
        marginTop: 35,
    }
});
