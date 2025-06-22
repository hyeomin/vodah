import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// 테스트 모드 타입
type MockUser = {
  id: string;
  email: string;
  provider: string;
};

type AuthContextType = {
  user: User | MockUser | null;
  session: Session | null;
  loading: boolean;
  signInWithKakao: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  withdraw: () => Promise<void>;
  isTestMode: boolean;
  setTestMode: (enabled: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTestMode, setTestMode] = useState(false);

  useEffect(() => {
    if (!isTestMode) {
      // 초기 세션 체크
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // 실시간 세션 변화 감지
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, [isTestMode]);

  // 테스트용 mock 로그인 함수
  const mockSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: MockUser = {
        id: `mock-${Math.random().toString(36).substr(2, 9)}`,
        email: `mock-user-${provider}@example.com`,
        provider: provider
      };
      setUser(mockUser);
      console.log(`Mock ${provider} sign in successful:`, mockUser);
    } catch (error) {
      console.error(`Mock ${provider} sign in error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithKakao = async () => {
    if (isTestMode) {
      console.log("Attempting mock Kakao sign in...");
      await mockSignIn('kakao');
      return;
    }

    try {
      console.log("Attempting Kakao sign in...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: 'moment://auth/callback',
          queryParams: {
            prompt: 'select_account',
          },
        }
      });
      
      if (error) {
        console.error("Kakao sign in error:", error);
        return;
      }
      
      console.log("Kakao sign in response:", data);
    } catch (error) {
      console.error("Unexpected error during Kakao sign in:", error);
    }
  };

  const signInWithApple = async () => {
    if (isTestMode) {
      console.log("Attempting mock Apple sign in...");
      await mockSignIn('apple');
      return;
    }

    try {
      console.log("Attempting Apple sign in...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'moment://auth/callback',
        }
      });
      
      if (error) {
        console.error("Apple sign in error:", error);
        return;
      }
      
      console.log("Apple sign in response:", data);
    } catch (error) {
      console.error("Unexpected error during Apple sign in:", error);
    }
  };

  const signInWithGoogle = async () => {
    if (isTestMode) {
      console.log("Attempting mock Google sign in...");
      await mockSignIn('google');
      return;
    }

    try {
      const redirectTo = makeRedirectUri({
        path: '/auth/callback',
      });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        return;
      }

      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (res.type === 'success') {
        const url = res.url;
        console.log("Google sign in response:", url);
        // URL에서 access_token과 refresh_token을 수동으로 추출
        const hash = url.split('#')[1];
        if (hash) {
          const params = hash.split('&').reduce((acc, part) => {
            const [key, value] = part.split('=');
            acc[decodeURIComponent(key)] = decodeURIComponent(value);
            return acc;
          }, {} as Record<string, string>);

          const accessToken = params['access_token'];
          const refreshToken = params['refresh_token'];

          if (accessToken && refreshToken) {
            // 수동으로 세션 설정
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error("Error setting session from URL:", error);
            }
          } else {
            console.error("Could not extract tokens from redirect URL hash");
          }
        } else {
          console.error("Redirect URL does not contain a hash fragment");
        }
      } else if (res.type === 'cancel' || res.type === 'dismiss') {
        console.log("Google OAuth flow was cancelled or dismissed by the user.");
      } else {
        console.warn("Google OAuth flow failed:", res);
      }
    } catch (error) {
      console.error("Unexpected error during Google sign in:", error);
    }
  };

  const signOut = async () => {
    if (isTestMode) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      setLoading(false);
      console.log("Mock sign out successful");
      return;
    }

    await supabase.auth.signOut();
  };

  const withdraw = async () => {
    if (isTestMode) {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser(null);
            console.log("Mock withdrawal successful");
        } finally {
            setLoading(false);
        }
        return;
    }

    // TODO: Add real withdrawal logic here
    console.log("Attempting real withdrawal...");
    setLoading(true);
    // Example: const { error } = await supabase.rpc('delete_user_account');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        loading,
        signInWithKakao,
        signInWithApple,
        signInWithGoogle,
        signOut,
        withdraw,
        isTestMode,
        setTestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 