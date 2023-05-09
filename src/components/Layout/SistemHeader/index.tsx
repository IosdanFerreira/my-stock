import React from 'react';
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

// auth
import { auth } from '@/services/firebase';

// redux
import { useAppDispatch } from '@/hooks/reduxHooks';

// firebase
import { signOut } from 'firebase/auth';

// cookies
import CookieServer from 'js-cookie';
import { logout } from '@/redux/user/slice';

export default function SistemHeader() {
  // Declaração das variáveis utilizadas
  const dispatch = useAppDispatch();
  const router = useRouter();

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

  return (
    <>
      <header className={styles.sistem__header__container}>
        <Container>
          <Row>
            <Col xs="12">
              <div className={styles.sistem__header__content}>
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className={styles.user__name}>
                      {auth.currentUser?.displayName}
                      <FiChevronDown />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
    </>
  );
}
