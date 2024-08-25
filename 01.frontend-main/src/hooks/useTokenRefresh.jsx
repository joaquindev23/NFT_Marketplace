import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshJWTToken } from '@/redux/actions/auth/auth';

export default function useTokenRefresh() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      // Refresh the token 5 minutes before expiration
      const refreshTime = (900 - 300) * 1000; // 900 seconds - 5 minutes = 600 seconds (10 minutes)

      const intervalId = setInterval(() => {
        dispatch(refreshJWTToken());
      }, refreshTime);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [dispatch, isAuthenticated]);
}
