'use client';
import React, { useState, createContext, useContext } from "react";


const GlobalContext = createContext();

export function useContextProvider() {
    return useContext(GlobalContext);
}

export function GlobalContextProvider({ children }) {
    const [isNightMode, setIsNightMode] = useState(false);
    const [menuHeight, setMenuHeight] = useState(0);
    const [refreshCount, setRefreshCount] = useState(0);


    const contextValue = {
        isNightMode,
        setIsNightMode,
        menuHeight,
        setMenuHeight,
        refreshCount,
        setRefreshCount
    };

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
}



