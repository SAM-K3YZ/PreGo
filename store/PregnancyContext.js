import { createContext, useState } from "react";

// Create the Context
const PregnancyContext = createContext();

function PregnancyProvider({ children }) {
    // Global State
    const [pregnancyDetails, setPregnancyDetails] = useState({
        trimester: "First trimester",
        conceptionDate: "2024-02-28",
        deliveryDate: "2024-11-29",
        daysPregnant: "4 days pregnant"
    });

    return (
        <PregnancyContext.Provider value={{ pregnancyDetails, setPregnancyDetails }}>
            {children}
        </PregnancyContext.Provider>
    );
}

export { PregnancyContext, PregnancyProvider };
