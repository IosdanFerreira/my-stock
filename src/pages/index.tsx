import React, { use, useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Structures
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form } from 'react-bootstrap';

// Icons
import { FaBoxOpen } from 'react-icons/fa';

// Form
import { Formik } from 'formik';
import * as Yup from 'yup';

// components
import InputTextLogin from '@/components/Inputs/InputTextLogin';
import InputPasswordLogin from '@/components/Inputs/InputPasswordLogin';
import AlertErrorMessage from '@/components/AlertErrorMessage';

// redux
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

// firebase
import { auth } from '@/services/firebase';
import { UserCredential, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { login } from '@/redux/user/slice';

// cookies
import CookieServer from 'js-cookie';
import Cookies from 'cookie';
import { GetServerSideProps } from 'next';

// utils
import { firebaseErrorsTranslate } from '@/utils/firebaseErrorsTranslate';

interface IFormValues {
  email: string;
  password: string;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = Cookies.parse(req.headers.cookie || '');

  const userAuth = cookies.user_auth;

  if (userAuth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Login() {

  // // Declaração das variáveis utilizadas
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Valores iniciais do formulário
  const initialValues: IFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email é obrigatório')
      .email('Insira um email válido'),
    password: Yup.string()
      .required('Senha é obrigatória')
      .min(8, 'A senha deve ter no mínimo 8 caracteres'),
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

  // Função que verifica se o email do usuário está autenticado, caso esteja, será realizado redirecionamento para o dashboard 
  const verifiedUserAuth = (userCredential: UserCredential) => {
    if(userCredential.user.emailVerified) {

      const user = userCredential.user;

      dispatch(login(user));

      if(user) {
        CookieServer.set('user_auth',  user.refreshToken);
      }

      router.push('/dashboard');

    } else {
      setErrorAlertMessage('Seu email não foi autenticado, por favor verifique sua caixa de entrada!');
    }
  };

  // Função que exclui o usuário se o email não foi verificado
  const deleteNoVerifiedUser = () => {

    const user = auth.currentUser;

    if(user) {
      deleteUser(user)
        .then(() => {

          setErrorAlertMessage('Usuário não cadastrado.');

        }).catch((error) => {
          
          console.log('Erro ao excluir o usuário não verificado:' + error);

        });
    }

  };

  // Função de login
  const loginUser = (values: IFormValues) => {

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {

        const userCreatedDate = Date.parse(String(userCredential.user.metadata.creationTime));
        const currentDate = new Date().getTime();

        if((currentDate - userCreatedDate >= 30 * 60 * 1000) && (!userCredential.user.emailVerified)) {

          deleteNoVerifiedUser();

        } else {

          verifiedUserAuth(userCredential);

        }

      })
      .catch((error) => {
        setErrorAlertMessage(firebaseErrorsTranslate(error.code));
      });

  };
  
  // Função de login aplicada ao formulário
  const handleSubmitForm = (values: IFormValues) => {
    loginUser(values);
  };

  return (
    <main className={styles.login__container}>
      <Container>
        <Row>
          <Col xs="12" className={styles.login__col}>
            <div className={styles.login__content}>
              <div className={styles.login__logo}>
                <FaBoxOpen />
                <h1>
                My Stock
                </h1>
              </div>
              <div className={styles.login__title}>
                <h6>Seja bem-vindo</h6>
                <h5>Faça login em sua conta</h5>
              </div>

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
                  <form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                      <InputTextLogin
                        type="text"
                        id="email"
                        name="email"
                        label="Email"
                        placeholder="Digite seu email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {showErrorMessage && (
                        <span className={styles.msg__error}>{errors.email && touched.email && errors.email}</span>
                      )}

                    </Form.Group>

                    <Form.Group className="mb-3">
                      <InputPasswordLogin
                        id="password"
                        name="password"
                        label="Senha"
                        placeholder="Digite sua senha"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {showErrorMessage && (
                        <span className={styles.msg__error}>{errors.password && touched.password && errors.password}</span>
                      )}
                    </Form.Group>

                    {ErrorAlertMessage && (
                      <AlertErrorMessage
                        message={ErrorAlertMessage}
                      />
                    )}
                    

                    <div className={styles.container__links}>
                      <Link className={styles.confirm__password} href='/register'>Não possui conta?</Link>
                      <Link className={styles.confirm__password} href='/reset_password_send_email'>Esqueceu sua senha?</Link>
                    </div>
                    
                    <button type="submit" onClick={handleShowErrorMessage} className={styles.btn_login}>Entrar</button>
                  </form>
                )}
              </Formik>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
