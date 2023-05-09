import React from 'react';
import { GetServerSideProps } from 'next';
import styles from './styles.module.scss';

// structures
import { Container, Row, Col } from 'react-bootstrap';

// Firebase
import { auth } from '@/services/firebase';
import Cookies from 'cookie';

// components
import SistemLayout from '@/components/Layout/SistemLayout';

// icons
import { BiSortDown, BiSortUp, BiBarChart } from 'react-icons/bi';

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
  return (
    <>
      <SistemLayout>
        <main className={styles.dashboard__container}>
          <Container>
            <Row>

              <Col sm="4">
                <div className={`${styles.info__card__container} ${styles.info__card__profit}`}>
                  <div className={styles.card__title}>
                    <h2>Entradas</h2>
                  </div>
                  <div className={styles.card__content}>
                    <h3 className={styles.profit__value}>+ R$ 20.000,00</h3>
                    <BiSortUp className={styles.profit} /> 
                  </div>
                </div>
              </Col>

              <Col sm="4">
                <div className={`${styles.info__card__container} ${styles.info__card__losses}`}>
                  <div className={styles.card__title}>
                    <h2>Saídas</h2>
                  </div>
                  <div className={styles.card__content}>
                    <h3 className={styles.losses__value}>- R$ 20.000,00</h3>
                    <BiSortDown className={styles.losses} />
                  </div>
                </div>
              </Col>

              <Col sm="4">
                <div className={`${styles.info__card__container} ${styles.info__card__losses}`}>
                  <div className={styles.card__title}>
                    <h2>Total</h2>
                  </div>
                  <div className={styles.card__content}>
                    <h3 className={styles.total__value}>- R$ 20.000,00</h3>
                    <BiBarChart className={styles.total} />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </SistemLayout>
    </>
  );
}
