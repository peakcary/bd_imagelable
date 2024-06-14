import React, { useRef, useState, useEffect } from 'react';
import { Button, Form, Input, Tooltip, Modal, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.css';

const { confirm } = Modal;

const InteractiveImage = ({ imgSrc, initialPoints = [], onSave }) => {
  const imageRef = useRef(null);
  const [points, setPoints] = useState(initialPoints);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [form] = Form.useForm();

  const handleImageClick = (e) => {
    if (draggingIndex !== null) return; // Prevent adding point while dragging
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoint({ x, y, name: '', color: '#ff0000', tips: '' });
    form.resetFields();
  };

  const handleInputChange = (e) => {
    setCurrentPoint({ ...currentPoint, [e.target.name]: e.target.value });
  };

  const handleSavePoint = () => {
    form.validateFields()
      .then((values) => {
        setPoints([...points, { ...currentPoint, ...values }]);
        setCurrentPoint(null);
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
      x: e.clientX - rect.left - points[index].x,
      y: e.clientY - rect.top - points[index].y
    });
  };

  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const rect = imageRef.current.getBoundingClientRect();
    const newPoints = [...points];
    newPoints[draggingIndex] = {
      ...newPoints[draggingIndex],
      x: e.clientX - rect.left - offset.x,
      y: e.clientY - rect.top - offset.y
    };
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  const handleDeletePoint = (index) => {
    confirm({
      title: 'Do you want to delete this point?',
      onOk() {
        const newPoints = [...points];
        newPoints.splice(index, 1);
        setPoints(newPoints);
      },
      onCancel() {},
    });
  };

  const savePoints = () => {
    if (onSave) {
      onSave(points);
    }
  };

  useEffect(() => {
    setPoints(initialPoints);
  }, [initialPoints]);

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
            top: point.y - 5,
            left: point.x - 5
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
          <Tooltip title={point.tips} visible={hoveredIndex === index}>
            <div className="label" style={{ top: '-25px', left: '15px', cursor: 'pointer' }}>
              {point.name}
            </div>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this point?"
            onConfirm={() => handleDeletePoint(index)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <div className="delete-icon" style={{ position: 'absolute', top: '-20px', right: '-20px', cursor: 'pointer' }}>
              <DeleteOutlined style={{ fontSize: '16px' }} />
            </div>
          </Popconfirm>
        </div>
      ))}
      {currentPoint && (
        <Modal
          title="Add Point"
          visible={true}
          onOk={handleSavePoint}
          onCancel={handleCancel}
          width={300}
        >
          <Form form={form} initialValues={currentPoint}>
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
      <Button onClick={savePoints} type="primary" style={{ marginTop: '10px' }}>Save Points</Button>
    </div>
  );
};

export default InteractiveImage;
