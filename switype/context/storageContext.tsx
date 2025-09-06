import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsContextType = {
    volume: number;
    music: number;
    language: string;
    setVolume: (v: number) => void;
    setMusic: (v: number) => void;
    setLanguage: (v: string) => void;
};

const defaultSettings = {
    volume: 50,
    music: 50,
    language: 'en',
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [volume, setVolumeState] = useState(defaultSettings.volume);
    const [music, setMusicState] = useState(defaultSettings.music);
    const [language, setLanguageState] = useState(defaultSettings.language);

    useEffect(() => {
        (async () => {
            const v = await AsyncStorage.getItem('volume');
            const m = await AsyncStorage.getItem('music');
            const l = await AsyncStorage.getItem('language');

            setVolumeState(v !== null ? Number(v) : defaultSettings.volume);
            setMusicState(m !== null ? Number(m) : defaultSettings.music);
            setLanguageState(l !== null ? String(l) : defaultSettings.language);
        })();
    }, []);

    const setVolume = (v: number) => {
        setVolumeState(v);
        AsyncStorage.setItem('volume', v.toString());
    };

    const setMusic = (m: number) => {
        setMusicState(m);
        AsyncStorage.setItem('music', m.toString());
    };

    const setLanguage = (l: string) => {
        setLanguageState(l);
        AsyncStorage.setItem('language', l);
    };

    return (
        <SettingsContext.Provider value={{ volume, music, language, setVolume, setMusic, setLanguage }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
    return ctx;
};
