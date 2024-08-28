import { Button, Col, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function StartQC() {
    const navigation = useNavigate();
    return (
        <div className="start-qc-container">
            <Header />
            <div className="content-wrapper">
                <h1>Do You want to start Quality Checks?</h1>
                <Row justify="center">
                    <Col>
                        <Button onClick={() => { navigation(-1) }}>Back</Button>
                        <Button type="primary" onClick={() => navigation('/qc-process')} style={{ marginLeft: '10px', }}>Yes</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default StartQC;
