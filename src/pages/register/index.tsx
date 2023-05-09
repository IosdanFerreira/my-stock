import React, { useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';

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

// firebase auth
import { auth } from '@/services/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, User, UserCredential } from 'firebase/auth';

// firebase firestore
import { db } from '@/services/firebase';
import { doc, setDoc } from 'firebase/firestore';

// utils
import { firebaseErrorsTranslate } from '@/utils/firebaseErrorsTranslate';

export default function Register() {

  // Declaração das variáveis utilizadas
  const router = useRouter();

  interface IFormValues {
    email: string;
    name: string;
    password: string;
    confirm_password: string;
  }

  const initialValues: IFormValues = {
    email: '',
    name: '',
    password: '',
    confirm_password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email é obrigatório')
      .email('Insira um email válido'),

    name: Yup.string()
      .required('Nome de usuário é obrigatório'),

    password: Yup.string()
      .required('Senha é obrigatória')
      .min(8, 'A senha deve ter no mínimo 8 caracteres'),

    confirm_password: Yup.string()
      .required('Confirme sua senha')
      .oneOf([Yup.ref('password')], 'As senhas devem ser iguais')
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

  // Verifica se o email do usuário já foi verificado
  const userEmailVerification = (user: User) => {
    if (user.emailVerified) {
      setErrorAlertMessage('Email já foi verificado');
      // Modal de notificação
    } else {
      sendEmailVerification(user)
        .then(() => {
          router.push('email_verification');
        })
        .catch((error) => {
          setErrorAlertMessage('Erro ao enviar email de verificação');
          console.log(error);
        });
    }
  };

  // Função que criar uma nova coleção de dados no firestore para o novo usuário cadastrado que só será acessado com o uid
  const createCollectionFromNewUser = async (user: User) => {
  
    if(user) {
      await setDoc(doc(db, 'users', `${user.uid}`), {
        nome: user.displayName,
        email: user.email,
        clientes: [],
        servicos: [],
        entradas: [],
        saidas: [],
      });
    }
  };
  
  // Função que cria novo usuário
  const createNewUSer = async (values: IFormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.confirm_password);
      const user = userCredential.user;
  
      await updateProfile(user, { displayName: values.name });
      userEmailVerification(user);
      await createCollectionFromNewUser(user);

    } catch (error: any) {
      setErrorAlertMessage(firebaseErrorsTranslate(error.code));
    }
  };

  const handleSubmitForm = (values: IFormValues) => {
    createNewUSer(values);
  };

  return (
    <main className={styles.register__container}>
      <Container>
        <Row>
          <Col xs="12" className={styles.register__col}>
            <div className={styles.register__content}>
              <div className={styles.register__logo}>
                <FaBoxOpen />
                <h1>
                My Stock
                </h1>
              </div>
              <div className={styles.register__title}>
                <h6>Não possui uma conta?</h6>
                <h5>Faça agora seu cadastro</h5>
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

                    <Form.Group className="mb-2">
                      <InputTextLogin
                        type="text"
                        id="name"
                        name="name"
                        label="Nome de usuário"
                        placeholder="Digite o nome de usuário"
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {showErrorMessage && (
                        <span className={styles.msg__error}>{errors.name && touched.name && errors.name}</span>
                      )}

                    </Form.Group>

                    <Form.Group className="mb-2">
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

                    <Form.Group className="mb-2">
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

                    <Form.Group className="mb-3">
                      <InputPasswordLogin
                        id="confirm_password"
                        name="confirm_password"
                        label="Cofirme sua senha"
                        placeholder="Digite sua senha novamente"
                        value={values.confirm_password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {showErrorMessage && (
                        <span className={styles.msg__error}>{errors.confirm_password && touched.confirm_password && errors.confirm_password}</span>
                      )}
                    </Form.Group>

                    {ErrorAlertMessage && (
                      <AlertErrorMessage
                        message={ErrorAlertMessage}
                      />
                    )}
                    
                    <button type="submit" onClick={handleShowErrorMessage} className={styles.btn_register}>Cadastrar</button>
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
