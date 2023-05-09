import React from 'react';
import styles from './styles.module.scss';

// structures
import { Container, Row, Col } from 'react-bootstrap';

// components
import SideMenu from '../SideMenu';
import SistemHeader from '../SistemHeader';

interface ISitemProps {
    children: React.ReactNode
}

export default function SistemLayout({children}: ISitemProps) {
  return (
    <Container fluid>
      <Row>
        <Col sm='2' className={styles.col__side__menu}>
          <SideMenu />
        </Col>
        <Col sm='10' className={styles.col__sistem_children}>
          <SistemHeader />
          {children}
        </Col>
      </Row>
    </Container>
  );
}
