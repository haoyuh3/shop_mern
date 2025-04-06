import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
              Copyright &copy; ProShop ｜ Tel：+86 123-4567-8901
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
