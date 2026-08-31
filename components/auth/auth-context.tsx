"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, type DbProfile } from "@/lib/supabase";

export type UserRole = "farmer" | "buyer" | "fpo" | "hub" | "admin";

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
  supabaseUserId?: string;
}

// ─── Demo Profiles (SIH Quick-Access fallback) ───
const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    id: "a1111111-1111-1111-1111-111111111111",
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
    id: "b2222222-2222-2222-2222-222222222222",
    name: "Anita Rao",
    role: "buyer",
    phone: "+91 97100 88990",
    email: "anita.rao@abcrestaurants.com",
    organization: "ABC Grand Hotels & Restaurants",
    location: "Chennai, Tamil Nadu",
    avatarLetter: "A",
    verified: true,
  },
  fpo: {
    id: "fpo-01",
    name: "FPO Manager",
    role: "fpo",
    phone: "+91 94440 11223",
    email: "fpo@abcfpo.in",
    organization: "ABC FPO Central",
    location: "Kanchipuram, Tamil Nadu",
    avatarLetter: "F",
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

function dbProfileToUser(dbProfile: DbProfile): UserProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.full_name,
    role: dbProfile.role as UserRole,
    phone: dbProfile.phone || "",
    email: dbProfile.email || "",
    organization: dbProfile.organization || "",
    location: dbProfile.location || "",
    avatarLetter: dbProfile.avatar_letter || dbProfile.full_name.charAt(0).toUpperCase(),
    verified: dbProfile.verified,
    supabaseUserId: dbProfile.user_id || undefined,
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, profile: {
    fullName: string;
    role: UserRole;
    phone?: string;
    organization?: string;
    location?: string;
  }) => Promise<{ error?: string }>;
  loginAs: (role: UserRole) => void; // SIH Demo quick-access
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (initialRole?: UserRole) => void;
  closeAuthModal: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  signIn: async () => ({}),
  signUp: async () => ({}),
  loginAs: () => {},
  logout: async () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ─── Restore session on mount ───
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1. Try Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          if (profile) {
            setUser(dbProfileToUser(profile as DbProfile));
            setLoading(false);
            return;
          }
        }
      } catch {
        // Supabase not configured — fall through to localStorage
      }

      // 2. Fallback: check localStorage demo session
      const savedRole = localStorage.getItem("f2m_user_role") as UserRole | null;
      if (savedRole && DEMO_PROFILES[savedRole]) {
        setUser(DEMO_PROFILES[savedRole]);
      }
      setLoading(false);
    };

    restoreSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          if (profile) {
            setUser(dbProfileToUser(profile as DbProfile));
            localStorage.removeItem("f2m_user_role"); // Clear demo session
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("f2m_user_role");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ─── Real Supabase Sign In ───
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return { error: authError.message };
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (profileError || !profile) {
          setError("Profile not found. Please contact support.");
          setLoading(false);
          return { error: "Profile not found" };
        }

        setUser(dbProfileToUser(profile as DbProfile));
        localStorage.removeItem("f2m_user_role");
      }
      setLoading(false);
      return {};
    } catch (err: any) {
      const msg = err?.message || "Sign in failed";
      setError(msg);
      setLoading(false);
      return { error: msg };
    }
  }, []);

  // ─── Real Supabase Sign Up ───
  const signUp = useCallback(async (
    email: string,
    password: string,
    profile: {
      fullName: string;
      role: UserRole;
      phone?: string;
      organization?: string;
      location?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return { error: authError.message };
      }

      if (data.user) {
        // Create profile row
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: data.user.id,
          full_name: profile.fullName,
          role: profile.role,
          phone: profile.phone || null,
          email: email,
          organization: profile.organization || null,
          location: profile.location || null,
          avatar_letter: profile.fullName.charAt(0).toUpperCase(),
          verified: false,
        });

        if (profileError) {
          setError("Account created but profile setup failed: " + profileError.message);
          setLoading(false);
          return { error: profileError.message };
        }

        // Fetch the created profile
        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (newProfile) {
          setUser(dbProfileToUser(newProfile as DbProfile));
        }
      }
      setLoading(false);
      return {};
    } catch (err: any) {
      const msg = err?.message || "Sign up failed";
      setError(msg);
      setLoading(false);
      return { error: msg };
    }
  }, []);

  // ─── SIH Demo Quick-Access (keeps backward compat) ───
  const loginAs = useCallback((role: UserRole) => {
    const profile = DEMO_PROFILES[role];
    setUser(profile);
    localStorage.setItem("f2m_user_role", role);
    setIsAuthModalOpen(false);
    setError(null);
  }, []);

  // ─── Logout ───
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured
    }
    setUser(null);
    localStorage.removeItem("f2m_user_role");
    setError(null);
  }, []);

  const openAuthModal = (initialRole?: UserRole) => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        signIn,
        signUp,
        loginAs,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
