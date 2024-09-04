import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';

const VoiceSearchComponent = () => {
  const [voiceText, setVoiceText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // Setup voice recognition
    Voice._onSpeechResults = onSpeechResultsHandler;

    // Speak the initial prompt
    Tts.speak("What do you want?");
  }, []);

  const onSpeechResultsHandler = (event) => {
    const text = event.value[0];
    setVoiceText(text);
    setSearchKeyword(text); // Set the spoken text as the search keyword
  };

  const startListening = () => {
    Voice.start('en-US'); // Start listening in English
  };

  const stopListening = () => {
    Voice.stop(); // Stop listening
  };

  const handleSearch = () => {
    // Perform search logic with searchKeyword
    console.log('Searching for:', searchKeyword);
  };

  return (
    <View>
      <Text>Voice Input: {voiceText}</Text>
      <TextInput
        placeholder="Search"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />
      <Button title="Start Listening" onPress={startListening} />
      <Button title="Stop Listening" onPress={stopListening} />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

export default VoiceSearchComponent;