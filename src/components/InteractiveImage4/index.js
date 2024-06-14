import React, { useRef, useState, useEffect } from 'react';
import { Button, Form, Input, Tooltip, Modal, Slider, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.css';

const InteractiveImage = ({ imgSrc, initialPoints = [], onSave }) => {
  const imageRef = useRef(null);
  const [points, setPoints] = useState(initialPoints);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [form] = Form.useForm();
  const [scale, setScale] = useState(1);

  const handleImageClick = (e) => {
    if (draggingIndex !== null) return; // Prevent adding point while dragging
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setCurrentPoint({ x, y, name: '', color: '#ff0000', tips: '' });
    form.resetFields();
  };

  const handleInputChange = (e) => {
    setCurrentPoint({ ...currentPoint, [e.target.name]: e.target.value });
  };

  const handleSavePoint = () => {
    form.validateFields()
      .then((values) => {
        const newPoints = [...points, { ...currentPoint, ...values }];
        setPoints(newPoints);
        setCurrentPoint(null);
        if (onSave) {
          onSave(newPoints);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setCurrentPoint(null);
  };

  const handleMouseDown = (index, e) => {
    const rect = imageRef.current.getBoundingClientRect();
    setDraggingIndex(index);
    setOffset({
      x: e.clientX - rect.left - points[index].x * scale,
      y: e.clientY - rect.top - points[index].y * scale
    }); 
  };

  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const rect = imageRef.current.getBoundingClientRect();
    const newPoints = [...points];
    newPoints[draggingIndex] = {
      ...newPoints[draggingIndex],
      x: (e.clientX - rect.left - offset.x) / scale,
      y: (e.clientY - rect.top - offset.y) / scale
    };
    setPoints(newPoints);
    
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };
 

  const handleDeletePoint = (index) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    if (onSave) {
      onSave(newPoints);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIndex, offset]);

  return (
    <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
      
      <div
        style={{
          position: 'relative',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          display: 'inline-block'
        }}
      >
        <img
          ref={imageRef}
          src={imgSrc}
          alt="Interactive"
          style={{ display: 'block', width: '100%' }}
          onClick={handleImageClick}
        />
        {points.map((point, index) => (
          <div
            key={index}
            className="point-container"
            style={{
              position: 'absolute',
              top: point.y * scale - 5,
              left: point.x * scale - 5
            }}
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="point"
              style={{
                width: 10,
                height: 10,
                backgroundColor: point.color,
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            ></div>
            <Tooltip title={point.tips} open={hoveredIndex === index}>
              <div className="label-container" style={{ position: 'relative', cursor: 'pointer' }}>
                <div className="label" style={{ top: '-25px', left: '15px' }}>
                  {point.name}
                </div>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeletePoint(index)}
                  style={{
                    position: 'absolute',
                    top: '-35px',
                    left: '80px',
                    color: 'red',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </Tooltip>
          </div>
        ))}
      </div>
      {currentPoint && (
        <Modal
          title="Add Point"
          open={true}
          onOk={handleSavePoint}
          onCancel={handleCancel}
          width={300}
        >
          <Form layout="vertical" form={form} initialValues={currentPoint}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: 'Please select the color!' }]}
            >
              <Input type="color" />
            </Form.Item>
            <Form.Item
              label="Tips"
              name="tips"
              rules={[{ required: true, message: 'Please input the tips!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Button onClick={() => onSave(points)} type="primary" style={{ marginTop: '10px' }}>
        Save Points
      </Button>
    </div>
  );
};

export default InteractiveImage;
