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
  password?: string;
}

// ─── 4 Core Dedicated Profiles with Real Credentials for Supabase Auth ───
export const PROD_PROFILES: Record<UserRole, { profile: UserProfile; defaultPass: string }> = {
  farmer: {
    profile: {
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
    defaultPass: "AgriHaat@2026",
  },
  buyer: {
    profile: {
      id: "b2222222-2222-2222-2222-222222222222",
      name: "Anita Rao",
      role: "buyer",
      phone: "+91 97100 88990",
      email: "anita.rao@abcrestaurants.com",
      organization: "ABC Grand Hotels & Restaurants",
      location: "Thousand Lights, Chennai",
      avatarLetter: "A",
      verified: true,
    },
    defaultPass: "AgriHaat@2026",
  },
  hub: {
    profile: {
      id: "c3333333-3333-3333-3333-333333333333",
      name: "Murugan S.",
      role: "hub",
      phone: "+91 94440 55667",
      email: "murugan@chennaisupplyhub.in",
      organization: "Kanchipuram-Walajabad Collection Hub",
      location: "Walajabad Junction, TN",
      avatarLetter: "M",
      verified: true,
    },
    defaultPass: "AgriHaat@2026",
  },
  fpo: {
    profile: {
      id: "d4444444-4444-4444-4444-444444444444",
      name: "Suresh Reddy",
      role: "fpo",
      phone: "+91 94400 88776",
      email: "suresh@greenfieldsfpo.org",
      organization: "GreenFields Farmer Producer Co.",
      location: "Walajabad, Tamil Nadu",
      avatarLetter: "S",
      verified: true,
    },
    defaultPass: "AgriHaat@2026",
  },
  admin: {
    profile: {
      id: "e5555555-5555-5555-5555-555555555555",
      name: "AgriHaat Central Admin",
      role: "admin",
      phone: "+91 98400 00000",
      email: "ops@agrihaat.ai",
      organization: "AgriHaat AI Central Operations",
      location: "Bengaluru / Chennai",
      avatarLetter: "A",
      verified: true,
    },
    defaultPass: "AgriHaat@2026",
  },
};

export const DEMO_PROFILES: Record<UserRole, UserProfile> = Object.fromEntries(
  Object.entries(PROD_PROFILES).map(([k, v]) => [k, v.profile])
) as Record<UserRole, UserProfile>;

export function dbProfileToUser(dbProfile: DbProfile): UserProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.full_name,
    role: dbProfile.role as UserRole,
    phone: dbProfile.phone || "",
    email: dbProfile.email || "",
    organization: dbProfile.organization || "",
    location: dbProfile.location || "",
    avatarLetter: dbProfile.avatar_letter || dbProfile.full_name?.charAt(0).toUpperCase() || "U",
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
  signUp: (
    email: string,
    password: string,
    profile: {
      fullName: string;
      role: UserRole;
      phone?: string;
      organization?: string;
      location?: string;
    }
  ) => Promise<{ error?: string }>;
  loginWithCredentials: (identifier: string, pass: string) => Promise<boolean>;
  registerUser: (profile: Omit<UserProfile, "id" | "avatarLetter" | "verified">) => Promise<void>;
  loginAs: (role: UserRole) => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
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
  loginWithCredentials: async () => false,
  registerUser: async () => {},
  loginAs: async () => {},
  loginAsDemo: () => {},
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

  // ─── Fetch profile by Supabase user id or email ───
  const fetchAndSetProfile = useCallback(async (userId: string, email?: string) => {
    try {
      let query = supabase.from("profiles").select("*");
      if (userId) {
        query = query.eq("user_id", userId);
      }
      let { data: profile } = await query.maybeSingle();

      if (!profile && email) {
        // Look up by email if user_id wasn't linked yet
        const { data: profileByEmail } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", email)
          .maybeSingle();
        if (profileByEmail) {
          // Link the user_id
          await supabase.from("profiles").update({ user_id: userId }).eq("id", profileByEmail.id);
          profile = profileByEmail;
        }
      }

      if (profile) {
        const u = dbProfileToUser(profile as DbProfile);
        setUser(u);
        if (typeof window !== "undefined") {
          localStorage.setItem("f2m_active_user", JSON.stringify(u));
        }
        return u;
      }
    } catch (e) {
      console.error("Error fetching Supabase profile:", e);
    }
    return null;
  }, []);

  // ─── Restore session on mount ───
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const u = await fetchAndSetProfile(session.user.id, session.user.email);
          if (u) {
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Supabase session check skipped:", err);
      }

      // Check localStorage for active session
      if (typeof window !== "undefined" && isMounted) {
        const saved = localStorage.getItem("f2m_active_user");
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            // ignore
          }
        } else {
          // Default initial profile for immediate preview
          setUser(DEMO_PROFILES.farmer);
        }
      }

      if (isMounted) setLoading(false);
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await fetchAndSetProfile(session.user.id, session.user.email);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("f2m_active_user");
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchAndSetProfile]);

  // ─── Real Supabase Sign In ───
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return { error: authError.message };
      }

      if (data.user) {
        const u = await fetchAndSetProfile(data.user.id, data.user.email);
        if (!u) {
          const fallbackUser: UserProfile = {
            id: data.user.id,
            name: email.split("@")[0],
            role: "farmer",
            email: email,
            phone: "",
            organization: "",
            location: "",
            avatarLetter: email.charAt(0).toUpperCase(),
            verified: true,
          };
          setUser(fallbackUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("f2m_active_user", JSON.stringify(fallbackUser));
          }
        }
      }
      setLoading(false);
      return {};
    } catch (err: any) {
      const msg = err?.message || "Sign in failed";
      setError(msg);
      setLoading(false);
      return { error: msg };
    }
  }, [fetchAndSetProfile]);

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
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return { error: authError.message };
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          user_id: data.user.id,
          full_name: profile.fullName,
          role: profile.role,
          phone: profile.phone || null,
          email: email.trim(),
          organization: profile.organization || null,
          location: profile.location || null,
          avatar_letter: profile.fullName.charAt(0).toUpperCase(),
          verified: true,
        });

        if (profileError) {
          console.warn("Profile table insert note:", profileError.message);
        }

        const newUser: UserProfile = {
          id: data.user.id,
          name: profile.fullName,
          role: profile.role,
          phone: profile.phone || "",
          email: email.trim(),
          organization: profile.organization || "",
          location: profile.location || "",
          avatarLetter: profile.fullName.charAt(0).toUpperCase(),
          verified: true,
          supabaseUserId: data.user.id,
        };

        setUser(newUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("f2m_active_user", JSON.stringify(newUser));
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

  // ─── 1-Click Authenticate Profile (Attempts Supabase Auth sign-in / auto-provision) ───
  const loginAs = useCallback(async (role: UserRole) => {
    setLoading(true);
    setError(null);
    const target = PROD_PROFILES[role] || PROD_PROFILES.farmer;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: target.profile.email,
        password: target.defaultPass,
      });

      if (!authError && data?.user) {
        await fetchAndSetProfile(data.user.id, target.profile.email);
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: target.profile.email,
          password: target.defaultPass,
        });
        if (!signUpError && signUpData?.user) {
          await supabase.from("profiles").upsert({
            id: target.profile.id,
            user_id: signUpData.user.id,
            full_name: target.profile.name,
            role: target.profile.role,
            phone: target.profile.phone,
            email: target.profile.email,
            organization: target.profile.organization,
            location: target.profile.location,
            avatar_letter: target.profile.avatarLetter,
            verified: true,
          });
          setUser({ ...target.profile, supabaseUserId: signUpData.user.id });
        } else {
          setUser(target.profile);
        }
      }
    } catch {
      setUser(target.profile);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.setItem("f2m_active_user", JSON.stringify(target.profile));
      }
      setLoading(false);
      setIsAuthModalOpen(false);
    }
  }, [fetchAndSetProfile]);

  const loginAsDemo = useCallback((role: UserRole) => {
    loginAs(role);
  }, [loginAs]);

  const loginWithCredentials = useCallback(async (identifier: string, pass: string): Promise<boolean> => {
    const res = await signIn(identifier, pass);
    return !res.error;
  }, [signIn]);

  const registerUser = useCallback(async (profileData: Omit<UserProfile, "id" | "avatarLetter" | "verified">) => {
    await signUp(profileData.email, profileData.password || "AgriHaat@2026", {
      fullName: profileData.name,
      role: profileData.role,
      phone: profileData.phone,
      organization: profileData.organization,
      location: profileData.location,
    });
  }, [signUp]);

  // ─── Logout ───
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("f2m_active_user");
    }
    setError(null);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
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
        loginWithCredentials,
        registerUser,
        loginAs,
        loginAsDemo,
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