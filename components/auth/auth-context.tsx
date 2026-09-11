"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "farmer" | "buyer" | "hub" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  organization: string;
  location: string;
  avatarLetter: string;
  verified: boolean;
  password?: string;
}

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    id: "farmer-01",
    name: "Ramesh Kumar",
    role: "farmer",
    phone: "+91 98401 23456",
    email: "ramesh.k@abcfpo.in",
    organization: "ABC Farmer Producer Organization",
    location: "Kanchipuram, Tamil Nadu",
    avatarLetter: "R",
    verified: true,
  },
  buyer: {
    id: "buyer-01",
    name: "Anita Rao",
    role: "buyer",
    phone: "+91 97100 88990",
    email: "anita.rao@abcrestaurants.com",
    organization: "ABC Grand Hotels & Restaurants",
    location: "Chennai, Tamil Nadu",
    avatarLetter: "A",
    verified: true,
  },
  hub: {
    id: "hub-01",
    name: "Murugan S.",
    role: "hub",
    phone: "+91 94440 55667",
    email: "murugan@chennaisupplyhub.in",
    organization: "Kanchipuram-Walajabad Collection Hub",
    location: "Walajabad Junction, TN",
    avatarLetter: "M",
    verified: true,
  },
  admin: {
    id: "admin-01",
    name: "AgriHaat Admin",
    phone: "+91 98400 00000",
    role: "admin",
    email: "ops@agrihaat.ai",
    organization: "AgriHaat AI Central Operations",
    location: "Bengaluru / Chennai",
    avatarLetter: "F",
    verified: true,
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  registerUser: (profile: Omit<UserProfile, "id" | "avatarLetter" | "verified">) => Promise<void>;
  loginWithCredentials: (identifier: string, pass: string) => Promise<boolean>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  registerUser: async () => {},
  loginWithCredentials: async () => false,
  loginAsDemo: () => {},
  logout: () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const activeSession = localStorage.getItem("f2m_active_user");
      if (activeSession) {
        try {
          return JSON.parse(activeSession);
        } catch (e) {
          console.error("Failed to restore session", e);
        }
      }
    }
    return DEMO_PROFILES.farmer;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeSession = localStorage.getItem("f2m_active_user");
      if (activeSession) {
        try {
          setUser(JSON.parse(activeSession));
        } catch (e) {
          console.error("Failed to restore session", e);
        }
      }
    }
  }, []);

  // Register user and push record to Supabase profiles table
  const registerUser = async (profileData: Omit<UserProfile, "id" | "avatarLetter" | "verified">) => {
    const newUser: UserProfile = {
      ...profileData,
      id: `user-${Date.now()}`,
      avatarLetter: profileData.name.charAt(0).toUpperCase(),
      verified: true,
    };

    // 1. Sync to Supabase
    try {
      const { error } = await supabase.from("profiles").insert([
        {
          id: newUser.id,
          name: newUser.name,
          role: newUser.role,
          phone: newUser.phone,
          email: newUser.email,
          organization: newUser.organization,
          location: newUser.location,
          avatar_letter: newUser.avatarLetter,
          verified: newUser.verified,
          password: newUser.password,
        },
      ]);
      if (error) console.error("Supabase Profile Sync Error:", error.message);
    } catch (err) {
      console.warn("Supabase insert bypassed or offline:", err);
    }

    // 2. Backup to LocalStorage
    const existingUsersRaw = localStorage.getItem("f2m_registered_users");
    const registeredUsers: UserProfile[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
    registeredUsers.push(newUser);

    localStorage.setItem("f2m_registered_users", JSON.stringify(registeredUsers));
    localStorage.setItem("f2m_active_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  // Login checking credentials against Supabase first, falling back to LocalStorage
  const loginWithCredentials = async (identifier: string, pass: string): Promise<boolean> => {
    // 1. Check Supabase
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`email.eq.${identifier},phone.eq.${identifier}`)
        .eq("password", pass)
        .maybeSingle();

      if (data && !error) {
        const fetchedUser: UserProfile = {
          id: data.id,
          name: data.name,
          role: data.role as UserRole,
          phone: data.phone,
          email: data.email,
          organization: data.organization,
          location: data.location,
          avatarLetter: data.avatar_letter || data.name.charAt(0).toUpperCase(),
          verified: data.verified,
        };
        setUser(fetchedUser);
        localStorage.setItem("f2m_active_user", JSON.stringify(fetchedUser));
        return true;
      }
    } catch (err) {
      console.warn("Supabase fetch bypassed or offline:", err);
    }

    // 2. Local fallback
    const existingUsersRaw = localStorage.getItem("f2m_registered_users");
    const registeredUsers: UserProfile[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    const matched = registeredUsers.find(
      (u) => (u.phone === identifier || u.email === identifier) && u.password === pass
    );

    if (matched) {
      setUser(matched);
      localStorage.setItem("f2m_active_user", JSON.stringify(matched));
      return true;
    }

    return false;
  };

  const loginAsDemo = (role: UserRole) => {
    const demoUser = DEMO_PROFILES[role];
    setUser(demoUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("f2m_active_user", JSON.stringify(demoUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("f2m_active_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        registerUser,
        loginWithCredentials,
        loginAsDemo,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}