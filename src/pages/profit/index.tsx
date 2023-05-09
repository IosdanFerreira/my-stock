import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

// structures
import { Container, Row, Col, Form } from 'react-bootstrap';

// antd
import { message } from 'antd';

// Firebase
import { auth, db } from '@/services/firebase';
import Cookies from 'cookie';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';

// components
import SistemLayout from '@/components/Layout/SistemLayout';
import InputTextLogin from '@/components/Inputs/InputTextLogin';
import { ProfitDataTable } from '@/components/ProfitDataTable';

// Form
import { Formik, FormikHelpers } from 'formik';
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

export default function Profit() {

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
  
  const [messageApi, contextHolder] = message.useMessage();
  const userId = auth.currentUser?.uid;

  const dataFromProfit = async (values: IFormValues) => {

    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const formatedDate = `${day}/${month}/${year}`;

    if(userId) {
      const userRef = doc(db, `users/${userId}`);
      await updateDoc(userRef, {
        entradas: arrayUnion({
          client: values.client,
          value: values.value,
          description: values.description,
          date: formatedDate,
        }),
      });
  
      const success = () => {
        messageApi.open({
          type: 'success',
          content: 'Registro de entrada criado com sucesso!',
        });
      };

      success();
      
    }};

  // pega os dados das entradas para exibir na tabela
  const [profitData, setProfitData] = useState([]);

  useEffect(() => {
    const docRef = doc(db, `users/${userId}`);

    const getdoc = async () => {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const entradas = data?.entradas || [];

          setProfitData(entradas);
          
        } else {
          console.log('Documento não encontrado.');
        }
      } catch (error) {
        console.log('Ocorreu um erro:', error);
      }
    };

    getdoc();
    
  }, [profitData]);

  // Função de login aplicada ao formulário
  const handleSubmitForm = (values: IFormValues, { resetForm }: FormikHelpers<IFormValues>):void => {
    dataFromProfit(values);
    setTimeout(() => {
      resetForm();
    }, 500);
  };  

  return (
    <>
      <SistemLayout>
        {contextHolder}
        <main className={styles.dashboard__container}>
          <Container>
            <Row>
              <Col sm="12">
                <div className={styles.register__profit__container}>
                  <h2>Registrar entrada</h2>

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
                      resetForm
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
                            placeholder="Ex. 150,00"
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

                    
                        <button 
                          type="submit" 
                          onClick={handleShowErrorMessage} 
                          className={styles.btn__register__value}>Registrar</button>
                      </form>
                    )}
                  </Formik>
                </div>
              </Col>
            </Row>
          </Container>

          <Container>
            <Row>
              <Col sm="12">
                <div className={`${styles.register__profit__container} ${styles.register__profit__table__container}`}>
                  <h2>Tabela das entrada</h2>

                  <ProfitDataTable data={profitData} />
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </SistemLayout>
    </>
  );
}
