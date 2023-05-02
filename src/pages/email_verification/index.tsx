import React, { useState } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPageContext } from 'next';

// Structures
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Icons
import { FaBoxOpen } from 'react-icons/fa';

// redux
import { useAppDispatch } from '@/hooks/reduxHooks';


export default function EmailVerification() {

  // Declaração das variáveis utilizadas
  const dispatch = useAppDispatch();
  const router = useRouter();

  
  return (
    <main className={styles.send__email__container}>
      <Container>
        <Row>
          <Col xs="12">
            <div className={styles.send__email__logo}>
              <FaBoxOpen />
              <h1>
                My Stock
              </h1>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col xs="12" className={styles.send__email__col}>
            <div className={styles.send__email__content}>

              <div className={styles.send__email__title}>
                <Image src='/images/send_email.png'
                  width={100}
                  height={100}
                  alt='Send Email'
                  className={styles.send__email__img}
                />

                <h6>Verifique seu email</h6>
                <p>Acabamos de enviar um link de verificação para o seu email, por favor, verifique sua caixa de entrada. Ao verificar seu email, clique no botão abaixo para fazer o login</p>

                <p><b>Importante</b>: se o email não for verificado em 30 minutos, seu cadastro será cancelado.</p>

                <button type="button" onClick={() => {router.push('/');}} className={styles.btn_return__to__login}>Fazer login</button>

              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
