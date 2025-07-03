import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContextType {
    urlContext: string;
    setUrlContext: (value: string) => void;
}

const CustomContext = createContext<ContextType | undefined>(undefined);

export const CustomContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [urlContext, setUrlContextState] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('urlContext') || '';
        }
        return '';
    });

    const setUrlContext = (value: string) => {
        setUrlContextState(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem('urlContext', value);
        }
    };

    return (
        <CustomContext.Provider value={{ urlContext, setUrlContext }}>
            {children}
        </CustomContext.Provider>
    );
};

export const useCustomContext = () => {
    const context = useContext(CustomContext);
    if (context === undefined) {
        throw new Error('useCustomContext must be used within a CustomContextProvider');
    }
    return context;
};
