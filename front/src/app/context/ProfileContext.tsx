'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface IUserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileContextValue {
  profile: IUserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<IUserProfile | null>>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function useProfileContext(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return ctx;
}

export default function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<IUserProfile>('/users/profile');
        if (isMounted) {
          setProfile(data);
        }
      } catch {
        // no-op: Sidebar/consumers can handle empty profile
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}


