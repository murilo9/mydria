import React from 'react';

import { Provider } from 'react-redux'
import actions from './actions'

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function App() {
  return (
    <Container>
      <Row className="row">
        <Col xs={12}>
          <h1>My New React Bootstrap SPA</h1>
          <Button variant="primary">Look, I'm a button!</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
