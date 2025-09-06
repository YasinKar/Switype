import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { LinearGradient as LinearGradientBg } from 'expo-linear-gradient';
import { icons } from '@/constants/icons';
import { useRouter } from 'expo-router';
import { fetchLanguages } from '@/services/api';
import useFetch from '@/services/useFetch';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { useSettings } from '@/context/storageContext';
import Error from '@/components/Error';

export default function Index() {
  const { volume, music, language, setVolume, setMusic, setLanguage } = useSettings();

  const {
    data: languages,
    loading: languagesLoading,
    error: languagesError
  } = useFetch(fetchLanguages)

  const [openLanguages, setOpenLanguages] = useState(false);
  const [items, setItems] = useState<Language[]>([]);

  const [visible, setVisible] = useState(false);

  const router = useRouter()

  useEffect(() => {
    if (languages) {
      setItems(languages);
    }
  }, [languages]);

  if (languagesLoading) return <Loading />;
  if (languagesError) return <Error msg={languagesError.message}/>

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

      <View className='flex-1 justify-center items-center z-50'>
        <Svg height="50" width="300">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#99e8f7" stopOpacity="1" />
              <Stop offset="1" stopColor="#00b4d8" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <SvgText
            fill="url(#grad)"
            fontSize="50"
            fontWeight="bold"
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
          >
            Switype..|
          </SvgText>
        </Svg>

        <View className='flex flex-col gap-5 mt-16'>
          <DropDownPicker
            open={openLanguages}
            value={language}
            items={items.map((item: Language) => ({
              label: item.name,
              value: item.code
            }))}
            setOpen={setOpenLanguages}
            setValue={(callbackOrValue) => {
              const newValue = typeof callbackOrValue === "function"
                ? callbackOrValue(language)
                : callbackOrValue;

              setLanguage(newValue);
            }}
            setItems={setItems}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            arrowIconStyle={styles.arrowIcon}
            modalContentContainerStyle={styles.modalContentContainer}
            modalTitle="Languages"
            modalTitleStyle={styles.modalTitle}
            placeholder="Language"
            listMode="MODAL"
            closeIconContainerStyle={styles.closeIconContainer}
            closeIconStyle={styles.closeIconContainer}
          />


          <TouchableOpacity
            onPress={() => setVisible(true)}
            className='border border-primary px-5 py-3 rounded-full flex-row gap-2 items-center justify-center'
          >
            <Text className='text-2xl text-primary'>SETTINGS</Text>
            <Image
              source={icons.settings}
              tintColor="#00b4d8"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/about')}
            className='border border-primary px-5 py-3 rounded-full flex-row gap-2 items-center justify-center'
          >
            <Text className='text-2xl text-primary'>ABOUT</Text>
            <Image
              source={icons.info}
              tintColor="#00b4d8"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/game')}
            className='border border-primary px-5 py-3 rounded-full flex-row gap-2 items-center justify-center'
          >
            <Text className='text-2xl text-primary'>
              START
            </Text>
            <Image
              tintColor={'#00b4d8'}
              source={icons.play}
            />
          </TouchableOpacity>

        </View>
        <Modal
          visible={visible}
          animationType="slide"
          transparent
          onRequestClose={() => setVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-accent border border-primary w-4/5 p-5 rounded-2xl">
              <Text className="text-xl text-primary font-bold mb-4">Settings</Text>

              <View className='flex flex-row gap-2 items-center mt-5'>
                <Image
                  source={icons.volume}
                  tintColor={'#00b4d8'}
                  className='size-6'
                />
                <Text className="mb-2 text-primary">
                  Sound : {volume}%
                </Text>
              </View>
              <Slider
                value={volume}
                onValueChange={setVolume}
                minimumValue={0}
                maximumValue={100}
                step={1}
              />

              <View className='flex flex-row gap-2 items-center mt-5'>
                <Image
                  source={icons.music}
                  tintColor={'#00b4d8'}
                  className='size-6'
                />
                <Text className="mb-2 text-primary">
                  Music : {music}%
                </Text>
              </View>
              <Slider
                value={music}
                onValueChange={setMusic}
                minimumValue={0}
                maximumValue={100}
                step={1}
              />

              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="mt-5 bg-primary px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-center">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
  },
  dropdown: {
    width: 250,
    borderColor: '#00b4d8',
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 18,
    color: '#00b4d8',
    textAlign: 'center',
  },
  arrowIcon: {
    width: 30,
    height: 30,
    tintColor: '#00b4d8',
  },
  modalContentContainer: {
    backgroundColor: '#000814',
    textAlign: 'center'
  },
  modalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeIconContainer: {
    tintColor: '#00b4d8',
    width: 30,
    height: 30,
  }
});
