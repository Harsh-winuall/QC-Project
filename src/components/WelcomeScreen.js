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

                    {/* Footer Section */}
                    <div className="welcome-screen-footer">
                        <div className="content">
                            <div className="footer-title">Contact Us</div>
                            <div className="footer-subtitle">
                                Not sure what to do? Our team will be happy to assist you.
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p>Contact Number: <a href="tel:+919513245671">+91 9513245671</a></p>
                            <p>Email: <a href="mailto:contact@edify.club">contact@edify.club</a></p>
                            <p>WhatsApp: <a href="https://wa.me/919513245671">https://wa.me/919513245671</a></p>
                        </div>
                    </div>

                </Col>
                <div className="border"></div>
                <Col md={11} xs={20} className="welcome-screen-form-col">
                        <div className="form-title" >
                            <p style={{fontWeight:500, fontSize:"30px", lineHeight:"24px", color:"#101112"}}>Welcome to the club!</p>
                            <p style={{width:"400px", fontSize:"18px", lineHeight:"16px", color:"#656B70"}}>Please enter the details to get started</p>
                        </div>

                        <form className="welcome-form" >

                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", width:"456px", height:"36px"}}>
                                <i class="fa-regular fa-user" style={{width:"20px", height:"20px", color:"gray"}}></i>
                                <input 
                                    placeholder="Username" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="welcome-screen-input"
                                />
                            </div>
                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", width:"456px", height:"36px"}}>
                                <i class="fa-regular fa-user" style={{width:"20px", height:"20px", color:"gray"}}></i>
                                <input 
                                    placeholder="Serial No" 
                                    value={serialNo} 
                                    onChange={(e) => setSerialNo(e.target.value)} 
                                    className="welcome-screen-input"
                                />
                            </div>


                            <button 
                                className="welcome-screen-button" 
                                onClick={handleNext}
                                size="large"
                            >
                                <p style={{width:"118px", height:"18px", color:"white", textAlign:"center", lineHeight:"18px", fontWeight:"500", justifyContent:"center"}}>GET STARTED</p>
                            </button>
                        </form>
                </Col>
            </Row>
        </div>
    );
};
