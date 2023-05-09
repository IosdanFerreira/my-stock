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
import AlertErrorMessage from '@/components/AlertErrorMessage';

// firebase auth
import { auth } from '@/services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

// utils
import { firebaseErrorsTranslate } from '@/utils/firebaseErrorsTranslate';

export default function ResetPasswordSendEmail() {

  interface IFormValues {
    email: string;
  }

  const initialValues: IFormValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email é obrigatório')
      .email('Insira um email válido'),
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

  const [isSendEmail, setIsSendEmail] = useState(false);

  const sendEmailForResetPassword = (email: string) => {

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsSendEmail(true);
      })
      .catch((error) => {
        setErrorAlertMessage(firebaseErrorsTranslate(error.code));
      });
  };

  const handleSubmitForm = (values: IFormValues) => {
    sendEmailForResetPassword(values.email);
  };

  return (
    <main className={styles.reset__password__container}>
      <Container>
        <Row>
          <Col xs="12">
            <div className={styles.logo}>
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
          {!isSendEmail ? (
            <Col xs="12" className={styles.reset__password__col}>
              <div className={styles.reset__password__content}>
                <div className={styles.reset__password__title}>
                  <h6>Esqueceu sua senha?</h6>

                  <p>Insira o email associado com sua conta e enviaremos uma messagem com as proximas etapas para redefinir sua senha.</p>
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

                      {ErrorAlertMessage && (
                        <AlertErrorMessage
                          message={ErrorAlertMessage}
                        />
                      )}
                    
                      <button type="submit" onClick={handleShowErrorMessage} className={styles.btn_reset__password}>Continuar</button>
                    </form>
                  )}
                </Formik>
              </div>
            </Col>
          ) : (
            <Col xs="12" className={styles.reset__password__col}>
              <div className={styles.reset__password__content}>
                <div className={styles.reset__password__title}>
                  <h6>Email enviado</h6>

                  <p>Enviamos uma mensagem com os proximos passos para o email informado, por favor verifique sua caixa de entrada.</p>
                </div>

                <Link href='/' className={styles.link_reset__password}>Voltar</Link>
              </div>
            </Col>
          )}
          
        </Row>
      </Container>
    </main>
  );
}
