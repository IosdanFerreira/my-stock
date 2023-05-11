import Link from 'next/link';
import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

import styles from './styles.module.scss';

// icons
import { AiOutlineBarChart } from 'react-icons/ai';
import { BiLineChart, BiLineChartDown, BiLogOut } from 'react-icons/bi';
import { FaBoxOpen } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

import { useAppDispatch } from '@/hooks/reduxHooks';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';

// cookies
import CookieServer from 'js-cookie';
import { auth } from '@/services/firebase';
import { logout } from '@/redux/user/slice';

interface IMenuProps {
    show: boolean;
    handleClose: () => void;
}

export default function SideMenuMobile({show, handleClose}: IMenuProps) {


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
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header>
          <Offcanvas.Title className={styles.menu__header__container}>
            <div className={styles.logo}>
              <FaBoxOpen />
              <h1>My Stock</h1>
            </div>
          </Offcanvas.Title>
          <button onClick={handleClose} className={styles.btn_close_modal}>
            <MdClose />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
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
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
