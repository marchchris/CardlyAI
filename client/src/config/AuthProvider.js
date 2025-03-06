import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification
  } from "firebase/auth";
  import { createContext, useEffect, useState } from "react";
  import PropTypes from "prop-types";
  import auth from "./FirebaseConfig";
  
  export const AuthContext = createContext(null);
  
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const createUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    };
  
    const loginUser = (email, password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
    };
  
    const logOut = () => {
      setLoading(true);
      return signOut(auth);
    };
  
    const resetPassword = (email) => {
      setLoading(true);
      return sendPasswordResetEmail(auth, email);
    };
  
    const reauthenticateUser = (email, password) => {
      const credential = EmailAuthProvider.credential(email, password);
      return reauthenticateWithCredential(auth.currentUser, credential);
    };
  
    const sendVerificationEmail = () => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        return sendEmailVerification(auth.currentUser);
      }
      return Promise.reject("No user is signed in or email is already verified");
    };
  
    const checkEmailVerification = () => {
      return auth.currentUser.reload().then(() => {
        return auth.currentUser.emailVerified;
      });
    };
  
    const cancelLoading = () => {
      setLoading(false);
      return null;
    };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    const authValue = {
      createUser,
      user,
      loginUser,
      logOut,
      loading,
      cancelLoading,
      resetPassword,
      reauthenticateUser,
      sendVerificationEmail,
      checkEmailVerification,
    };
  
    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
  };
  
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export default AuthProvider;