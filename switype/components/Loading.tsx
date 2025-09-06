import { View, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient as LinearGradientBg } from 'expo-linear-gradient'
import Svg, { Defs, LinearGradient, Stop, Text } from 'react-native-svg'

const Loading = () => {
    const text = 'Loading...'
    const [displayed, setDisplayed] = useState('')
    const [typing, setTyping] = useState(true)

    useEffect(() => {
        let timeout;

        if (typing) {
            if (displayed.length < text.length) {
                timeout = setTimeout(() => {
                    setDisplayed(text.slice(0, displayed.length + 1));
                }, 80);
            } else {
                timeout = setTimeout(() => setTyping(false), 500);
            }
        } else {
            if (displayed.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayed(text.slice(0, displayed.length - 1));
                }, 80);
            } else {
                timeout = setTimeout(() => setTyping(true), 500);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayed, typing, text]);

    return (
        <View
            className='flex-1 bg-accent'
        >
            <View style={styles.background}>
                <LinearGradientBg
                    colors={['#00b4d8', 'transparent']}
                    style={[styles.light, styles.rightLight]}
                />
                <LinearGradientBg
                    colors={['#00b4d8', 'transparent']}
                    style={[styles.light, styles.leftLight]}
                />
            </View>

            <View className='h-screen flex items-center justify-center'>
                <Svg height="50" width="300">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor="#99e8f7" stopOpacity="1" />
                            <Stop offset="1" stopColor="#00b4d8" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Text
                        fill="url(#grad)"
                        fontSize="40"
                        fontWeight="bold"
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dy=".3em"
                    >
                        {displayed + '|'}
                    </Text>
                </Svg>
            </View>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    light: {
        position: 'absolute',
        borderRadius: 999,
        filter: 'blur(90px)',
        mixBlendMode: 'lighten',
        opacity: 0.7,
        zIndex: 0,
    },
    leftLight: {
        width: 300,
        height: 300,
        top: 50,
        left: -70,
    },
    rightLight: {
        width: 200,
        height: 200,
        bottom: 100,
        right: -50,
    },
})