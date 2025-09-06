import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as LinearGradientBg } from 'expo-linear-gradient';
import useFetch from '@/services/useFetch';
import { fetchSettings } from '@/services/api';
import Loading from '@/components/Loading';
import { useEffect, useState } from 'react';
import Error from '@/components/Error';

export default function About() {
  const {
    data: settings,
    loading: settingsLoading,
    error: settingsError
  } = useFetch(fetchSettings)

  const [settingsData, setSettingsData] = useState<null | Settings>(null);

  useEffect(() => {
    if (settings) {
      setSettingsData(settings);
    }
  }, [settings]);

  if (settingsLoading) return <Loading />;
  if (settingsError) return <Error msg={settingsError.message}/>

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

      <ScrollView
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1, zIndex: 1000 }}
      >
        <Svg height="50" width="300">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#99e8f7" stopOpacity="1" />
              <Stop offset="1" stopColor="#00b4d8" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <SvgText
            fill="url(#grad)"
            fontSize="28"
            fontWeight="bold"
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
          >
            About Switype
          </SvgText>
        </Svg>
        <Text className='text-primary text-xl text-center p-3'>{settingsData?.site_description}</Text>
        <Text className='text-primary font-bold text-xl text-center p-3'>Developer : {settingsData?.email}</Text>
        <Text className='text-primary font-bold text-lg text-center p-5'>{settingsData?.copyright}</Text>
      </ScrollView>
    </View>
  );
}

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
  }
});
