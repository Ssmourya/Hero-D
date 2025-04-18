import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleGenerateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate mobile number (must be 10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the direct API endpoint
      const baseUrl = 'https://hero-d-nry1.vercel.app/api';

      const response = await fetch(`${baseUrl}/auth/generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setMessage('OTP has been sent to your WhatsApp. Please check your WhatsApp messages.');
      setShowOtpInput(true);

      // In a real app, you wouldn't store the OTP in the frontend
      // This is just for testing purposes
      if (data.otp) {
        setGeneratedOtp(data.otp);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate OTP (must be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the direct API endpoint
      const baseUrl = 'https://hero-d-nry1.vercel.app/api';

      const response = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      setMessage('OTP verified successfully. You can now reset your password.');

      // Navigate to reset password page with the token
      setTimeout(() => {
        navigate(`/reset-password/${data.resetToken}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {!showOtpInput
              ? 'Enter your mobile number to receive an OTP for password reset.'
              : 'Enter the OTP sent to your mobile number.'}
          </p>
        </div>

        {!showOtpInput ? (
          <form className="mt-8 space-y-6" onSubmit={handleGenerateOTP}>
            {message && (
              <div className="text-green-600 text-center text-sm bg-green-50 p-3 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="mobile" className="sr-only">
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Mobile Number (10 digits only, e.g., 9876543210)"
                value={mobile}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  // Limit to 10 digits
                  setMobile(value.slice(0, 10));

                  // Validate as user types
                  if (value.length > 0 && value.length !== 10) {
                    setMobileError('Mobile number must be exactly 10 digits');
                  } else {
                    setMobileError('');
                  }
                }}
              />
              {mobileError && (
                <p className="mt-1 text-sm text-red-600">{mobileError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isSubmitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            {message && (
              <div className="text-green-600 text-center text-sm bg-green-50 p-3 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            {generatedOtp && (
              <div className="text-blue-600 text-center text-sm bg-blue-50 p-3 rounded-md">
                For testing: Your OTP is {generatedOtp}.
                <br/>
                <span className="font-semibold">Please check your WhatsApp messages if you don't receive the OTP within a minute.</span>
              </div>
            )}
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                pattern="[0-9]{6}"
                maxLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  // Limit to 6 digits
                  setOtp(value.slice(0, 6));

                  // Validate as user types
                  if (value.length > 0 && value.length !== 6) {
                    setOtpError('OTP must be exactly 6 digits');
                  } else {
                    setOtpError('');
                  }
                }}
              />
              {otpError && (
                <p className="mt-1 text-sm text-red-600">{otpError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isSubmitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive OTP?{' '}
                <button
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
