import { Button, Col, Row, Input, Form, Select, DatePicker } from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";

export const UserDetailsForm = () => {
    const location = useLocation();
    const navigation = useNavigate();
    const [config, setConfig] = useState({
        processor: '',
        processor_generation: '',
        storage:'',
        item_code:'',
        item_name:'',
        screen_size_in_inches: '',
        reported_on: '',
        model_number: '',
    });

    const handleNext = () => {
        // console.log(config);
        navigation("/confirm-start-qc", {state:
            {...location.state, config}
        });
    };

    return (
        <div className="user-details-container">
            <Header/>
            <Row justify="center" style={{ marginTop: "5vh" }}>
                <Col md={16} xs={24} className="form-container">
                    <Row justify="start" align="middle" style={{ marginBottom: "24px" }}>
                        <i onClick={()=> navigation(-1)} class="fa-solid fa-circle-chevron-left" style={{fontSize:"20px", cursor:"pointer"}}></i>
                        <h1 className="form-title">Fill in your Laptop Details</h1>
                    </Row>
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Serial Number">
                                    <Input value={location.state.serialNo} readOnly/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Username">
                                    <Input value={location.state.username} readOnly />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Processor Generation">
                                    <Select placeholder="Select Processor Generation" onChange={(value)=> setConfig({...config, processor_generation:value})}>
                                        {["2nd Gen (2011)", "3rd Gen (2012)", "4th Gen (2013)", "5th Gen (2014)", "6th Gen (2015)", "7th Gen (2016)", "8th Gen (2017)", "9th Gen (2018)", "10th Gen (2019-2020)", "11th Gen (2021)", "12th Gen (2021)", "Other"].map((gen) => (
                                            <Select.Option key={gen} value={gen}>{gen}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Processor">
                                    <Select placeholder="Select Processor" onChange={(value)=> setConfig({...config, processor:value})}>
                                        {["Intel Core i3", "Intel Core i4", "Intel Core i5", "Intel Core i6", "Intel Core i7", "Intel Core i9", "Mac M1 Chip", "Mac M2 Chip", "Mac M3 Chip", "AMD Ryzen", "AMD Ryzen 5 Pro", "Other"].map((proc) => (
                                            <Select.Option key={proc} value={proc}>{proc}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Screen Size (In Inches)">
                                    <Select placeholder="Select Screen Size" onChange={(value)=> setConfig({...config, screen_size_in_inches:value})}>
                                        {["10 inches", "10.1 inches", "10.6 inches", "11 inches", "11.6 inches", "12 inches", "12.1 inches", "12.3 inches", "12.5 inches", "13 inches", "13.3 inches", "13.4 inches", "13.5 inches", "13.9 inches", "14 inches", "14.1 inches", "14.2 inches", "15 inches", "15.4 inches", "15.6 inches", "16 inches", "16.1 inches", "17 inches", "17.3 inches", "18.4 inches", "19 inches", "Other"].map((size) => (
                                            <Select.Option key={size} value={size}>{size}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="RAM">
                                    <Select placeholder="Select RAM" onChange={(value)=> setConfig({...config, ram:value})}>
                                        {["4GB", "8GB", "12GB", "16GB", "32GB", "24GB", "Other"].map((ram) => (
                                            <Select.Option key={ram} value={ram}>{ram}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Storage">
                                    <Select placeholder="Select Storage" onChange={(value)=> setConfig({...config, storage:value})}>
                                        {["128GB", "250GB", "256GB", "320GB", "500GB", "512GB", "1TB", "1TB/256SSD", "2TB", "Other"].map((storage) => (
                                            <Select.Option key={storage} value={storage}>{storage}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Model Number">
                                    <Input placeholder="Enter Model Number" value={config.model_number} onChange={(e)=> setConfig({...config, model_number:e.target.value})}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Reported On">
                                    <DatePicker onChange={(date)=> setConfig({...config, reported_on:date})} style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button type="primary" className="form-button" onClick={handleNext}>
                            Next
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};
