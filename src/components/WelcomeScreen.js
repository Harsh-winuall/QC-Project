import { Button, Col, Row, Input, Form } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLaptopImage from "../assets/Images/login-laptop-image.png";
import Header from "./Header";

export const WelcomeScreen = () => {
    const navigation = useNavigate();
    const [serialNo, setSerialNo] = useState("");
    const [username, setUsername] = useState("");

    const handleNext = () => {
        if (serialNo && username) {
            navigation("/confirm-start-qc", { state: { serialNo, username } });
        }
    };

    return (
        <div className="welcome-screen-container">
            <Header/>
            <Row justify="center" align="middle" className="welcome-screen-content">
                <Col md={13} xs={0} className="welcome-screen-image-col">
                    <img src={loginLaptopImage} className="welcome-screen-image" alt="Laptop" />
                </Col>
                <Col md={11} xs={20} className="welcome-screen-form-col">
                    <h1 className="welcome-screen-title">Welcome to the Club!</h1>
                    <Form layout="vertical">
                        <Form.Item label="Serial Number">
                            <Input 
                                placeholder="Enter Serial Number" 
                                value={serialNo} 
                                onChange={(e) => setSerialNo(e.target.value)} 
                                className="welcome-screen-input"
                            />
                        </Form.Item>
                        <Form.Item label="Username">
                            <Input 
                                placeholder="Enter Username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="welcome-screen-input"
                            />
                        </Form.Item>
                        <Button 
                            type="primary" 
                            className="welcome-screen-button" 
                            onClick={handleNext}
                            size="large"
                        >
                            Next
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* Footer Section */}
            <div className="welcome-screen-footer">
                <div className="footer-title">Contact Us</div>
                <div className="footer-subtitle">
                    Not sure what to do? Our team will be happy to assist you.
                </div>
                <div className="footer-contact">
                    Contact Number: <a href="tel:+919513245671">+91 9513245671</a>
                </div>
                <div className="footer-contact">
                    Email: <a href="mailto:contact@edify.club">contact@edify.club</a>
                </div>
                <div className="footer-contact">
                    WhatsApp: <a href="https://wa.me/919513245671">https://wa.me/919513245671</a>
                </div>
            </div>
        </div>
    );
};
