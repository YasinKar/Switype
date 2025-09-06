import { LinearGradient as LinearGradientBg } from 'expo-linear-gradient';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { icons } from '@/constants/icons';
import Slider from '@react-native-community/slider';
import { useSettings } from '@/context/storageContext';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';

const audioSource = require('../assets/music.mp3')

const { width, height } = Dimensions.get('window');

const getXPosition = (side: string) => {
  switch (side) {
    case 'left':
      return 20;
    case 'right':
      return width - 120;
    case 'center':
      return width / 2 - 50;
    default:
      return width / 2 - 50;
  }
};

const getRandomSide = () => {
  const sides = ['left', 'right', 'center'];
  return sides[Math.floor(Math.random() * sides.length)];
};

const AnimatedWord = ({
  word,
  side,
  delay,
  speedMultiplier,
  renderWord,
  onMissed,
  setAnimatedWords,
}: {
  word: string;
  side: string;
  delay: number;
  speedMultiplier: number;
  renderWord: (word: string) => JSX.Element
  onMissed: (word: string) => void;
  setAnimatedWords: React.Dispatch<React.SetStateAction<Word[]>>
}) => {
  const translateY = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(-30);
    opacity.setValue(0);

    const duration = 12000 / speedMultiplier;

    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: height - 100,
          duration,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      requestAnimationFrame(() => {
        setAnimatedWords(prev => {
          const exists = prev.find(w => w.word === word);
          if (exists) {
            onMissed(word);
          }
          return prev;
        });
      });
    });
  }, [delay, speedMultiplier]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        position: 'absolute',
        top: 0,
        left: getXPosition(side),
        width: 100,
      }}
    >
      {renderWord(word)}
    </Animated.View>
  );
};

const RoundStartAnimation = ({ round, onFinish }: { round: number; onFinish: () => void }) => {
  const translateX = useRef(new Animated.Value(-width)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: width,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: height / 2 - 50,
        transform: [{ translateX }],
        opacity,
      }}
    >
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
            fontSize="40"
            fontWeight="bold"
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
          >
            Round{round + 1}
          </SvgText>
        </Svg>
      </View>
    </Animated.View>
  );
};

interface Word {
  id: number;
  word: string;
  side: string;
  delay: number;
}

export default function Game() {
  const { volume, music, language, setVolume, setMusic } = useSettings();

  const randomPage = Math.floor(Math.random() * (350 - 150 + 1)) + 150;

  const fetchWords = async (page: number) => {
    const endpoint = `${process.env.EXPO_PUBLIC_BASE_API_URL}v1/languages/${language}/words?per_page=5&page=${page}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Api-Key ${process.env.EXPO_PUBLIC_BACKEND_API_KEY}`
      }
    })

    if (!response.ok) {
      // @ts-ignore
      throw new Error("failed to fetch words", response.statusText);
    }

    const data = await response.json()

    return data
  }

  const router = useRouter()

  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    player.play()
  }, []);

  useEffect(() => {
    if (music === 0) {
      player.muted = true
    } else {
      player.muted = false;
      player.volume = music / 100;
    }
  }, [music]);

  const [animatedWords, setAnimatedWords] = useState<Word[]>([]);

  const [typedWords, setTypedWords] = useState<string[]>([])
  const [selectedWord, setSelectedWord] = useState('')
  const [typedText, setTypedText] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState<Score>({
    accuracy: '',
    speed: ''
  })
  const [gameOverModal, setGameOverModal] = useState(false);
  const [totalTypedChars, setTotalTypedChars] = useState(0)
  const [totalErrors, setTotalErrors] = useState(0)
  const [heart, seHeart] = useState(5)

  const [roundIndex, setRoundIndex] = useState(0);
  const [showRoundAnimation, setShowRoundAnimation] = useState(true);

  const [paused, setPaused] = useState(false);

  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    setStartTime(Date.now())
    inputRef.current?.focus()
  }, [])

  // Runs each time round a round starts
  useEffect(() => {
    setShowRoundAnimation(true);
  }, [roundIndex]);

  // Set words to Start the Game
  useEffect(() => {
    const getWords = async () => {
      const words = await fetchWords(randomPage + roundIndex).then(
        res => res.words
      )

      const currentWords: string[] = words
      const speedMultiplier = 1 + roundIndex * 0.3;

      const newWords: Word[] = currentWords.map((word, i) => ({
        id: Date.now() + i,
        word,
        side: getRandomSide(),
        delay: i * 500,
      }));

      setAnimatedWords(newWords);

      const roundDuration = 12500 / speedMultiplier;
      const timer = setTimeout(() => {
        setTypedText('');
        setSelectedWord('');
        setAnimatedWords([]);
        setRoundIndex((prev) => prev + 1);
        setTypedWords([]);
      }, roundDuration + words.length * 500);

      return () => clearTimeout(timer);
    }
    getWords()
  }, [roundIndex]);

  // Decrease the Heart on Misstakes
  const handleMissedWord = (word: string) => {
    if (!typedWords.includes(word)) {
      seHeart(prev => {
        const newHeart = prev - 1;
        if (newHeart <= 0) {
          const totalTime = (Date.now() - startTime!) / 1000
          const accuracy = ((totalTypedChars - totalErrors) / totalTypedChars) * 100 || 0
          const speed = totalTypedChars / totalTime
          setScore({ speed: speed.toFixed(2), accuracy: accuracy.toFixed(2) })
          setFinished(true)
          setGameOverModal(true)
          return 0;
        }
        return newHeart;
      });

      setAnimatedWords(prev => prev.filter(w => w.word !== word));
    }
  };

  // Select the Word by the first char that entered
  function selectByPrefix(input: string) {
    const prefix = (input || "").trim().toLowerCase();
    if (!prefix) return
    const found = animatedWords.find(w => (w.word || "").toLowerCase().startsWith(prefix));
    if (!found) return
    setSelectedWord(found.word)
    return found
  }

  // Checks the typed text and update score and words...
  const onChangeText = (text: string) => {
    if (finished) return

    const currentWord = selectByPrefix(text)
    if (!currentWord) return

    if (text.length > currentWord.word.length) return

    setTypedText(text)

    // Counts the misstakes
    let errors = 0
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== currentWord.word[i]) {
        errors++
      }
    }
    setTotalErrors(prev => prev + errors)

    if (text === currentWord.word) {
      setTotalTypedChars(prev => prev + currentWord.word.length)

      const newTypedWords = [...typedWords, text];
      setTypedWords(newTypedWords);
      setAnimatedWords(prev => prev.filter(w => w.id !== currentWord.id));

      if (newTypedWords.length === 5) {
        setTypedText('');
        setSelectedWord('');
        setAnimatedWords([]);
        setRoundIndex((prev) => prev + 1);
        setTypedWords([]);
      } else {
        setTypedText('');
        setSelectedWord('');
      }
    }
  }

  // Render Words Bases on Typed Text 
  const renderWord = (word: string) => {
    return (
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        {word.split('').map((letter, index) => {
          let color = '#99e8f7'

          if (word === selectedWord) {
            if (typedText[index]) {
              color = typedText[index] === letter ? '#00b4d8' : '#99e8f7'
            }
          }

          return (
            <Text key={index} style={{ color }}>
              {letter}
            </Text>
          )
        })}
      </Text>
    )
  }

  return (
    <View className="flex-1 bg-accent">
      {/* Pause & Hearts */}
      <View
        className='absolute top-16 right-8 z-50 flex-col justify-center items-center gap-5'
      >
        <TouchableOpacity
          onPress={() => setPaused(!paused)}
          className='rounded-full border-2 border-primary p-5'
        >
          <Image
            source={paused ? icons.play : icons.pause}
            tintColor={'#00b4d8'}
          />
        </TouchableOpacity>

        <View className='flex-row items-center justify-center gap-2'>
          <Text className='text-primary text-2xl font-bold'>{heart}</Text>
          <Image
            source={icons.heart}
            tintColor={'#00b4d8'}
            className='size-10'
          />
        </View>
      </View>

      {/* Bg  */}
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

      {/* Word Animations */}
      <View className="overflow-hidden flex-1 z-40">
        {animatedWords.map(({ id, word, side, delay }) => (
          <AnimatedWord
            key={id}
            word={word}
            side={side}
            delay={delay}
            speedMultiplier={1 + roundIndex * 0.3}
            renderWord={renderWord}
            onMissed={handleMissedWord}
            setAnimatedWords={setAnimatedWords}
          />
        ))}
      </View>

      {/* Round Animation  */}
      {showRoundAnimation && (
        <RoundStartAnimation
          round={roundIndex}
          onFinish={() => {
            setShowRoundAnimation(false);
          }}
        />
      )}

      {/* Input  */}
      {!finished && (
        <>
          <TextInput
            value={typedText}
            className='mb-10 w-5/6 border border-primary m-auto rounded-lg text-primary p-3 font-medium text-lg'
            onChangeText={onChangeText}
            autoFocus
            ref={inputRef}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </>
      )}

      {/* Pause Modal  */}
      <Modal
        visible={paused}
        animationType="slide"
        transparent
        onRequestClose={() => setPaused(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-accent border border-primary w-4/5 p-5 rounded-2xl">
            <Text className="text-xl text-primary font-bold mb-4">Paused</Text>

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
              onPress={() => setPaused(false)}
              className="mt-5 px-4 py-4 rounded-lg border border-primary flex-row items-center justify-center gap-2"
            >
              <Text className="text-primary text-center text-l">
                Continue
              </Text>
              <Image
                source={icons.play}
                tintColor={'#00b4d8'}
                className='size-5'
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Game Over Modal  */}
      <Modal
        visible={gameOverModal}
        animationType="slide"
        transparent
        onRequestClose={() => setGameOverModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-accent border border-primary w-4/5 p-5 rounded-2xl">
            <Text className="text-2xl text-primary font-bold mb-4 text-center">Game Over</Text>
            <Text className="text-primary mb-2 text-center">Speed: {score.speed} chars/sec</Text>
            <Text className="text-primary mb-5 text-center">Accuracy: {score.accuracy}%</Text>

            <TouchableOpacity
              onPress={() => {
                seHeart(5);
                setRoundIndex(0);
                setTotalErrors(0);
                setTotalTypedChars(0);
                setTypedWords([]);
                setAnimatedWords([]);
                setTypedText('');
                setSelectedWord('');
                setFinished(false);
                setGameOverModal(false);
                setStartTime(Date.now());
              }}
              className="mt-2 px-4 py-3 rounded-lg border border-primary flex-row items-center justify-center gap-2"
            >
              <Text className="text-primary font-bold">Restart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/')}
              className="mt-2 px-4 py-3 rounded-lg border border-primary flex-row items-center justify-center gap-2"
            >
              <Text className="text-primary font-bold">Back to Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
});