import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/forgot-password/ForgotPasswordForm';
import EmailSentMessage from '../components/forgot-password/EmailSentMessage';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/forgot-password', { email });
      
      navigate('/verify-otp', { state: { email: email } });
      setEmailSent(true);

    } catch (apiError) {
      const message =
        apiError.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {!emailSent ? (
          <ForgotPasswordForm 
            email={email}
            setEmail={setEmail}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
          />
        ) : (
          <EmailSentMessage email={email} />
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-cyan-600 hover:underline">
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
