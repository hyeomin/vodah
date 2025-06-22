import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import AppText from '@/components/Apptext';

const CallbackScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <AppText>잠시만 기다려주세요...</AppText>
    </View>
  );
};

export default CallbackScreen;