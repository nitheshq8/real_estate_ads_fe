import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const AuthComponent = (props: any) => {
        const router = useRouter();
        const[isLoading,setIsLoading]= useState(false)
        const { user, setUser }:any ={}
        //  useContext();
        const [isCheckingAuth, setIsCheckingAuth] = useState(true);

        useEffect(() => {
            setIsLoading(true)
            const checkAuth = async () => {
                if (!user) {
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) {
                        setUser(JSON.parse(savedUser));
                    } else {
                         //   router.push('/login'); // Redirect to login if not authenticated
                    }
                }
                setIsCheckingAuth(false);
            };

            checkAuth();
            setIsLoading(false)
        }, [user, router, setUser]);
        if (isLoading ) {
            return  <Loader />
        }
        if (isCheckingAuth) {
            return <></>
            // <LoginRegisterModal closeModal={ ()=>router.push(`/`)} />
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
