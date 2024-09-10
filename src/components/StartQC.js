import { Button, Col, Row } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import loginLaptopImage from "../assets/Images/login-laptop-image.png";
import Header from './Header';

function StartQC() {
    const navigation = useNavigate();
    const location = useLocation();
    console.log(location.state);
    return (
        <div className="start-qc-container">
            <Header />
            <div className="content-wrapper">
                <div className="welcome-screen-image-col">
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
                </div>
                <div className='border'/>
                <div className='right-content'>
                    <div>
                        <div style={{width:"456px", height:"40px", fontWeight:500, fontSize:"24px", lineHeight:"40px", color:"#101112", textAlign:"left"}}>Do you want to start quality checks?</div>
                        <div style={{width:"456px", height:"16px", fontWeight:400, lineHeight:"16px", fontSize:"18px", color:"#656B70", textAlign:"left"}}>Please enter the details to get started</div>
                    </div>
                    <div className='confirm-btn'>
                        <button onClick={() => { navigation(-1) }}>No</button>
                        <button type="primary" onClick={() => navigation('/qc-process', {state:{...location.state}})} style={{ marginLeft: '10px', }}>Yes</button>
                    </div>
                </div>
            </div>
        </div>

        
    );
}

export default StartQC;
