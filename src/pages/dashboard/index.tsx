import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

// redux
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout } from '@/redux/user/slice';

// Firebase
import { auth } from '@/services/firebase';
import { signOut  } from 'firebase/auth';
import Cookies from 'cookie';
import CookieServer from 'js-cookie';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = Cookies.parse(req.headers.cookie || '');

  const cookieAuth = cookies.user_auth;
  const userToken = auth.currentUser?.refreshToken;

  const authToken = cookieAuth !== userToken;

  if (!authToken) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};


export default function Dashboard() {
  
  // Declaração das variáveis utilizadas
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  
  const logOutUser = () => {
    signOut(auth).then(() => {

      CookieServer.remove('user_auth');
      dispatch(logout());
      router.push('/');

    }).catch((error) => {
      console.log(`Erro ao deslogar usuário ${error}`);
    });
  };

  return (
    <>
  
      <div>Dashboard</div>
      <button type='button' onClick={logOutUser} >Sair</button>
    </>
  );
}
