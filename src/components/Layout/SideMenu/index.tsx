import React from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';

// icons
import { FaBoxOpen } from 'react-icons/fa';
import { TbUsers } from 'react-icons/tb';
import { AiOutlineBarChart } from 'react-icons/ai';
import { GiShakingHands } from 'react-icons/gi';
import { BiLineChart, BiLineChartDown, BiLogOut } from 'react-icons/bi';

// redux
import { useAppDispatch } from '@/hooks/reduxHooks';

// firebase
import { signOut } from 'firebase/auth';

// cookies
import CookieServer from 'js-cookie';
import { auth } from '@/services/firebase';
import { logout } from '@/redux/user/slice';

export default function SideMenu() {

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
    <aside className={styles.menu__container}>
      <div className={styles.logo}>
        <FaBoxOpen />
        <h1>My Stock</h1>
      </div>

      <div className={styles.menu__options}>
        <ul>
          <li>
            <Link href='/dashboard'><AiOutlineBarChart /> Dashboard</Link>
          </li>
          <li>
            <Link href='/profit'><BiLineChart /> Entradas</Link>
          </li>
          <li>
            <Link href='/losses'><BiLineChartDown /> Saídas</Link>
          </li>
        </ul>

        <button type='button' className={styles.btn__logout} onClick={logOutUser}>
          <BiLogOut /> 
              Sair
        </button>

      </div>
    </aside>
  );
}
