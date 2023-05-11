import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

// antd
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

// structures
import { Container, Row, Col } from 'react-bootstrap';

// icons
import { FiChevronDown } from 'react-icons/fi';
import {GiHamburgerMenu} from 'react-icons/gi';
import {FaBoxOpen} from 'react-icons/fa';

// auth
import { auth } from '@/services/firebase';

// redux
import { useAppDispatch } from '@/hooks/reduxHooks';

// firebase
import { signOut } from 'firebase/auth';

// cookies
import CookieServer from 'js-cookie';
import { logout } from '@/redux/user/slice';
import SideMenuMobile from '../SideMenuMobile';

// redux
import { useAppSelector } from '@/hooks/reduxHooks';

export default function SistemHeader() {
  // Declaração das variáveis utilizadas
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {user} = useAppSelector((state) => state.userReducer);

  const logOutUser = () => {
    signOut(auth)
      .then(() => {
        CookieServer.remove('user_auth');
        dispatch(logout());
        router.push('/');
      })
      .catch((error) => {
        console.log(`Erro ao deslogar usuário ${error}`);
      });
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button type="button" className={styles.btn__logout} onClick={logOutUser}>
          Sair
        </button>
      ),
    },
  ];

  // Mostra menu mobile
  const [showMenu, setShowMenu] = useState(false);

  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);

  return (
    <>
      <header className={styles.sistem__header__container}>
        <Container>
          <Row>
            <Col xs="12">
              <div className={styles.sistem__header__content}>
                <button type='button' className={styles.btn__open__menu__mobile} onClick={handleShow}><GiHamburgerMenu /></button>
                <div className={styles.logo}>
                  <FaBoxOpen />
                  <h1>My Stock</h1>
                </div>
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className={styles.user__name}>
                      {user.displayName}
                      <FiChevronDown />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      {showMenu && (
        <SideMenuMobile show={showMenu} handleClose={handleClose} />
      )}
    </>
  );
}
