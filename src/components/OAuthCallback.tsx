import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthService } from '../lib/oauthService';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL search params
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('No authorization code received');
        }

        const response = await oauthService.handleCallback(code);

        if (response.error) {
          throw new Error(response.error.message);
        }

        if (!response.data?.token) {
          throw new Error('No token received from server');
        }

        // Token is already stored by oauthService
        // Redirect to home page or dashboard
        navigate('/', { replace: true });
      } catch (error: any) {
        console.error('Authentication callback failed:', error);
        setError(error.message || 'Authentication failed');
        // Redirect to login page after a short delay if there's an error
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-2">Redirecting to login page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completing authentication...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
