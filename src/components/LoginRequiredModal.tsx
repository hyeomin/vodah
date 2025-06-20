import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';

type LoginRequiredModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function LoginRequiredModal({ isVisible, onClose }: LoginRequiredModalProps) {
  const pathname = usePathname();

  const handleLogin = () => {
    onClose();
    router.push({
        pathname: '/login',
        params: { redirect: pathname }
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="mx-5 w-[80%] bg-white rounded-2xl p-6 items-center shadow-lg">
          <Text className="mb-6 text-center text-base leading-6 text-[#1A1A1A]">
            로그인 후에 이용 가능합니다.{'\n'}로그인 하시겠습니까?
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              className="flex-1 bg-[#F5F5F5] rounded-lg py-3"
              onPress={onClose}
            >
              <Text className="text-center text-sm font-semibold text-[#1A1A1A]">
                닫기
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-[#8889BD] rounded-lg py-3"
              onPress={handleLogin}
            >
              <Text className="text-center text-sm font-semibold text-white">
                예
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
} 