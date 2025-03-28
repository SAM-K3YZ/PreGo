import { Image } from "react-native";
import { GlobalColor } from "./style";

import yogaPose from "../assets/illustrations/yoga_pose.png";
import weightCheck from "../assets/illustrations/weight_check.png";
import bowlOfFood from '../assets/illustrations/food.png';

export const subScreenCards = [
    {
        id: 1,
        title: "Still feeling anxious?",
        subtitle: "Why don't you try meditating...?",
        img: yogaPose,
        btn: "Meditate",
        btnBg: GlobalColor.darkColors.white,
        bgColor: GlobalColor.lightColors.accentPink,
    },

    {
        id: 2,
        title: "Stay Active",
        subtitle: "Exercise is good for you and your baby!",
        img: weightCheck,
        btn: "Record",
        btnBg: GlobalColor.darkColors.white,
        bgColor: GlobalColor.lightColors.accentYellow,
    },

    {
        id: 3,
        title: "Eat Healthy",
        subtitle: "A balanced diet is key to a healthy pregnancy. How are you feeling today?",
        img: bowlOfFood,
        btn: "Log Pregnancy",
        btnBg: GlobalColor.darkColors.white,
        bgColor: GlobalColor.lightColors.accentBlue,
    },
];

export const exerciseData = [
    {
        id: 1,
        trimester: "First Trimester",
        focus: "Low-impact, moderate-intensity exercises to build endurance and mobility.",
        exercises: [
            { name: "Walking", description: "20–30 minutes a day, 3–5 times per week." },
            { name: "Swimming", description: "Full-body workout, gentle on joints." },
            { name: "Prenatal Yoga", description: "Helps with relaxation and flexibility." },
            { name: "Pelvic Floor Exercises (Kegels)", description: "Strengthens muscles for labor." },
            { name: "Light Strength Training", description: "Using body weight or light dumbbells." },
        ],
    },
    {
        id: 2,
        trimester: "Second Trimester",
        focus: "Strength and stability, preparing for added weight and balance changes.",
        exercises: [
            { name: "Stationary Cycling", description: "Good for cardio without stressing joints." },
            { name: "Prenatal Pilates", description: "Strengthens core, reduces back pain." },
            { name: "Modified Planks", description: "Strengthens core without lying on the belly." },
            { name: "Squats & Lunges", description: "Strengthens legs and improves blood circulation." },
            { name: "Arm & Leg Lifts", description: "Maintains stability and strength." },
        ],
    },
    {
        id: 3,
        trimester: "Third Trimester",
        focus: "Gentle movements, breathing exercises, and labor preparation.",
        exercises: [
            { name: "Prenatal Stretching", description: "Loosens tight muscles, improves circulation." },
            { name: "Pelvic Tilts", description: "Relieves lower back pain." },
            { name: "Birth Ball Exercises", description: "Helps with posture and relaxation." },
            { name: "Slow & Controlled Walking", description: "Keeps circulation active." },
            { name: "Deep Breathing & Meditation", description: "Prepares for labor, reduces stress." },
        ],
    },
];

