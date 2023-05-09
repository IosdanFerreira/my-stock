import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

// structures
import { Container, Row, Col, Form } from 'react-bootstrap';

// Firebase
import { auth } from '@/services/firebase';
import Cookies from 'cookie';

// components
import SistemLayout from '@/components/Layout/SistemLayout';
import InputTextLogin from '@/components/Inputs/InputTextLogin';

// Form
import { Formik } from 'formik';
import * as Yup from 'yup';

// redux
import { useAppDispatch } from '@/hooks/reduxHooks';

interface IFormValues {
    client: string;
    description: string;
    value: string;
  }

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

export default function Losses() {

  // // Declaração das variáveis utilizadas
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Valores iniciais do formulário
  const initialValues: IFormValues = {
    client: '',
    description: '',
    value: '',

  };

  const validationSchema = Yup.object({
    client: Yup.string()
      .required('Cliente é obrigatório'),
    value: Yup.string()
      .required('Valor é obrigatório'),
  });

  // Exibe as mensagens de erro do formulário
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [submted, setSubmted] = useState(false);

  const [ErrorAlertMessage, setErrorAlertMessage] = useState('');

  const handleShowErrorMessage = () => {
    if (!submted) {
      setShowErrorMessage(true);

      return;
    } else {
      setShowErrorMessage(false);
    }
  };

  // Função de login aplicada ao formulário
  const handleSubmitForm = (values: IFormValues):void => {
    alert(JSON.stringify(values));
  };

  return (
    <>
      <SistemLayout>
        <main className={styles.dashboard__container}>
          <Container>
            <Row>
              <Col sm="12">
                <div className={styles.register__profit__container}>
                  <h2>Registrar saída</h2>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    }) => (
                      <form onSubmit={handleSubmit} className='row'>

                        <Form.Group className="mb-3 col-sm-6">
                          <InputTextLogin
                            type="text"
                            id="client"
                            name="client"
                            label="Cliente"
                            placeholder="Digite o nome do cliente"
                            value={values.client}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {showErrorMessage && (
                            <span className={styles.msg__error}>{errors.client && touched.client && errors.client}</span>
                          )}

                        </Form.Group>

                        <Form.Group className="mb-3 col-sm-6">
                          <InputTextLogin
                            type='text'
                            id="value"
                            name="value"
                            label="Valor (R$)"
                            placeholder="Digite o valor da transação"
                            value={values.value}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {showErrorMessage && (
                            <span className={styles.msg__error}>{errors.value && touched.value && errors.value}</span>
                          )}

                        </Form.Group>

                        <Form.Group className="mb-3 col-12">
                          <InputTextLogin
                            type="text"
                            id="description"
                            name="description"
                            label="Descrição"
                            placeholder="Escreva algo para identificar a transação"
                            value={values.description}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {showErrorMessage && (
                            <span className={styles.msg__error}>{errors.description && touched.description && errors.description}</span>
                          )}

                        </Form.Group>

                    
                        <button type="submit" onClick={handleShowErrorMessage} className={styles.btn__register__value}>Registrar</button>
                      </form>
                    )}
                  </Formik>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </SistemLayout>
    </>
  );
}
