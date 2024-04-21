// root/frontend/app/utils/authContext.js
"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";
import UserService from "../services/userService";

const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Assuming the role information is available in the userProfile fetched from the database
  const [errorMessages, setErrorMessages] = useState(null);
  const [successfulMessages, setSuccessfulMessages] = useState(null);


  //hook to limiting resend verification email to once every 5 minutes
  const [lastEmailSentTime, setLastEmailSentTime] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        await enrichUser(currentUser);
        // Check if the user exists in your database
      } else {
        setUser(null);
        // setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);


  //enrich user with role from profile--------------------------------
  const enrichUser = async (firebaseUser) => {
    if (!firebaseUser) {
      return;
    }
    try {
      const profile = await UserService.getUser(firebaseUser.uid);
      if (profile) {
        const enrichedUser = {
          ...firebaseUser,
          role: profile.role,
          name: profile.firstName + ' ' + profile.lastName,
          profile: profile,
        };
        setUser(enrichedUser);
      } else {
        // Handle case where no profile is returned
        setUser({
          ...firebaseUser,
          role: 'guest', // Default role if no profile is found
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setErrorMessages("Failed to load user profile.");
      setTimeout(() => {
        setErrorMessages(null);
      },5000);
    }
  };

    // Additional useEffect to enrich user on refresh/reload if user is already set
    useEffect(() => {
      if (user && !user.profile) {
        enrichUser(user);
      }
    }, [user]);

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    } catch (error) {
      // Handle Google sign-in errors
      setErrorMessages('Error signing in with Google');
      console.error('Google Sign-In Error:', error);
    }
  };


  const signUpWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setSuccessfulMessages("Successfully signed up. Check your email for a verification link to verify your email address. Then go to login page.");
      setTimeout(() => {
        setSuccessfulMessages(null);
      }, 3000);
      return userCredential;
    } catch (error) {
      // Handle sign-up errors
      setErrorMessages('Error during sign-up', error.message);
      setTimeout(() => {
        setErrorMessages(null);
      }, 10000);
    }
  };
    



  const emailSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (!firebaseUser.emailVerified) {
        const currentTime = new Date();
        if (!lastEmailSentTime || currentTime - lastEmailSentTime >= 180000) { // 180000ms = 3 minutes
          try {
            await sendEmailVerification(firebaseUser);
            setErrorMessages('You have not verified your email. A verification email has been sent to your email address. Follow the link in the email to verify your email.');
            setTimeout(() => {
              setErrorMessages(null);
            }, 15000);
            setLastEmailSentTime(currentTime);
          } catch (error) {
            console.error('Error sending verification email:', error);
            setErrorMessages('Failed to send verification email. Check your email for existing verification code or try again later.');
            setTimeout(() => {
              setErrorMessages(null);
            }, 15000);
          }
        } else {
          setErrorMessages("You have not verified your email. Check your email for a verification link or wait 5 minutes and try login again for a new verification email.");
          setTimeout(() => {
            setErrorMessages(null);
          }, 15000);
        }
        return;
      } else {
        // Initialize a default user object
        let userWithProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          role: 'user', // Default role
          name: '', // Default name
          profile: {} // Default empty profile
        };
  
        try {
          const profile = await UserService.getUser(firebaseUser.uid);
          if (profile) {
            // If profile exists, enrich the user object with additional details
            userWithProfile = {
              ...userWithProfile,
              role: profile.role,
              name: profile.firstName + ' ' + profile.lastName,
              profile: profile,
            };
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Optionally, set an error message state here
        }
  
        setUser(userWithProfile);
        setSuccessfulMessages('Successfully signed in. Redirecting to the home page.');
        setTimeout(() => {
          setSuccessfulMessages(null);
          window.location.href = '/';
        }, 3000);
      }
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessages('User does not exist.');
          break;
        case "auth/wrong-password":
          setErrorMessages('Incorrect password.');
          break;
        default:
          setErrorMessages(`Error signing in: ${error.message}`);
          break;
      }
      setTimeout(() => {
        setErrorMessages(null);
      }, 10000);
    }
  };




  const firebaseSignOut = () => {
    return signOut(auth);
  };


  return (
    <AuthContext.Provider
      value={{ user, googleSignIn, emailSignIn, firebaseSignOut, errorMessages, successfulMessages, signUpWithEmailAndPassword}}
    >
      {children}
    </AuthContext.Provider>
    );
  };


export const useUserAuth = () => {
  return useContext(AuthContext);
};


