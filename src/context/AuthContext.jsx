import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

async function saveUserProfile(uid, profile) {
  await setDoc(doc(db, "users", uid), profile);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const profileDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setUserProfile(profileDoc.exists() ? profileDoc.data() : null);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register({ name, email, password, role, phone = "" }) {
    const profile = {
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };

    let credential = null;

    try {
      credential = await createUserWithEmailAndPassword(auth, email, password);
      const fullProfile = { ...profile, uid: credential.user.uid };
      await saveUserProfile(credential.user.uid, fullProfile);
      setUserProfile(fullProfile);
      return credential.user;
    } catch (error) {
      if (error?.code === "auth/email-already-in-use") {
        const existing = await signInWithEmailAndPassword(auth, email, password);
        const profileDoc = await getDoc(doc(db, "users", existing.user.uid));

        if (!profileDoc.exists()) {
          const fullProfile = { ...profile, uid: existing.user.uid };
          await saveUserProfile(existing.user.uid, fullProfile);
          setUserProfile(fullProfile);
          return existing.user;
        }

        throw error;
      }

      if (credential?.user) {
        try {
          await deleteUser(credential.user);
          await signOut(auth);
        } catch {
          // Auth user may need manual cleanup in Firebase Console
        }
      }

      throw error;
    }
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profileDoc = await getDoc(doc(db, "users", credential.user.uid));
    const profile = profileDoc.exists() ? profileDoc.data() : null;
    setUserProfile(profile);
    return { user: credential.user, profile };
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  async function updateProfile(updates) {
    if (!user) {
      throw new Error("Not logged in");
    }

    const updated = {
      ...userProfile,
      ...updates,
      uid: user.uid,
      role: userProfile?.role,
      createdAt: userProfile?.createdAt || new Date().toISOString(),
    };

    await saveUserProfile(user.uid, updated);
    setUserProfile(updated);
    return updated;
  }

  const value = {
    user,
    userProfile,
    role: userProfile?.role || null,
    loading,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
