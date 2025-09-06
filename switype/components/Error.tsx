import { View, StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const Error = ({ msg }: { msg: string }) => {
    return (
        <View
            className='flex-1 bg-accent'
        >
            <View style={styles.background}>
                <LinearGradient
                    colors={['#00b4d8', 'transparent']}
                    style={[styles.light, styles.rightLight]}
                />
                <LinearGradient
                    colors={['#00b4d8', 'transparent']}
                    style={[styles.light, styles.leftLight]}
                />
            </View>

            <View className='h-screen flex items-center justify-center'>
                <Text className='text-3xl text-primary font-medium'>{msg}</Text>
            </View>
        </View>
    )
}

export default Error

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