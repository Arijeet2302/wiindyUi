import { useState } from 'react';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import styles from "../styles/signup.module.css";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleResetPassword = async () => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth,email);  
      if (methods.length === 0) {
        setMessage('Email is not associated with any account.');
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        await sendPasswordResetEmail(auth,email);
        alert('Password reset email sent. Check your inbox.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking email existence or sending reset email:', error);
      setMessage("Please Enter Valid Email");
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };
  

  return (
    <div className={styles.innerBox}>
      <h2 className={styles.heading}>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className={styles.footer}>
      <button onClick={handleResetPassword}>Reset Password</button>
      <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
