import React, { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import styles from './styles.module.scss';

// structures
import { Container, Row, Col } from 'react-bootstrap';

// Firebase
import { auth, db } from '@/services/firebase';
import Cookies from 'cookie';

// components
import SistemLayout from '@/components/Layout/SistemLayout';

// icons
import { BiSortDown, BiSortUp, BiBarChart } from 'react-icons/bi';
import { doc, getDoc } from 'firebase/firestore';
import { Console } from 'console';

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

interface IDataProps {
  client: string;
  value: string;
  description: string;
  date: string;
}

export default function Dashboard() {

  const userId = auth.currentUser?.uid;

  // pega os dados das saídas para exibir
  const [lossesData, setLossesData] = useState<IDataProps[]>([]);

  useEffect(() => {
    const docRef = doc(db, `users/${userId}`);

    const getdoc = async () => {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const saidas = await data?.saidas || [];

          setLossesData(saidas);
        
        } else {
          console.log('Documento não encontrado.');
        }
      } catch (error) {
        console.log('Ocorreu um erro:', error);
      }
    };

    getdoc();
  
  }, []);

  const totalLosses = lossesData.reduce((acc, curr) => acc + parseFloat(curr.value.replace(',', '')), 0);

  // pega os dados das saídas para exibir
  const [profitData, setProfitData] = useState<IDataProps[]>([]);

  useEffect(() => {
    const docRef = doc(db, `users/${userId}`);

    const getdoc = async () => {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const entradas = await data?.entradas || [];

          setProfitData(entradas);
        
        } else {
          console.log('Documento não encontrado.');
        }
      } catch (error) {
        console.log('Ocorreu um erro:', error);
      }
    };

    getdoc();
  
  }, []);

  const totalProfit = profitData.reduce((acc, curr) => acc + parseFloat(curr.value.replace(',', '')), 0);

  const totalValue = totalProfit - totalLosses;

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
                    <h3 className={styles.profit__value}>R$ + {(totalProfit / 100).toFixed(2).replace('.', ',')}</h3>
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
                    <h3 className={styles.losses__value}>R$ - {(totalLosses / 100).toFixed(2).replace('.', ',')}</h3>
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
                    <h3 className={styles.total__value}>R$ {(totalValue / 100).toFixed(2).replace('.', ',')}</h3>
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
