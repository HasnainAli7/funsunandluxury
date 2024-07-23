import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      const token = document.cookie.includes('token');
      if (!token) {
        router.push('/login');
      }
    }, [isAuthenticated, router]);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
