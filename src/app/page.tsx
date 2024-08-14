"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import type { User } from "firebase/auth";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (!userDoc.exists()) {
            // Retrieve data from local storage
            const registrationData = localStorage.getItem("registrationData");
            const {
              firstName = "",
              lastName = "",
              gender = "",
            } = registrationData ? JSON.parse(registrationData) : {};

            // Create the user document in Firestore
            await setDoc(doc(firestore, "users", user.uid), {
              firstName,
              lastName,
              gender,
              email: user.email,
            });

            // Clear local storage after storing in Firestore
            localStorage.removeItem("registrationData");
          }
          setUser(user);
        } else {
          setLoading(false);
          setUser(null)
          router.push("/login");
        }
      } else {
        setLoading(false);
        setUser(null)
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
    </div>
  );
};

export default HomePage;
