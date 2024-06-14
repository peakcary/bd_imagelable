import React, { useState } from 'react';

const PointComponent = ({ imageUrl, initialPoints, onPointsChange }) => {
  const [points, setPoints] = useState(initialPoints);

  const handlePointDrag = (index, newPosition) => {
    const updatedPoints = [...points];
    updatedPoints[index].position = newPosition;
    setPoints(updatedPoints);
    onPointsChange(updatedPoints);
  };

  const handlePointDelete = (index) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setPoints(updatedPoints);
    onPointsChange(updatedPoints);
  };

  const handlePointNameChange = (index, newName) => {
    const updatedPoints = [...points];
    updatedPoints[index].name = newName;
    setPoints(updatedPoints);
    onPointsChange(updatedPoints);
  };

  const handlePointTipsChange = (index, newTips) => {
    const updatedPoints = [...points];
    updatedPoints[index].tips = newTips;
    setPoints(updatedPoints);
    onPointsChange(updatedPoints);
  };

  const handlePointColorChange = (index, newColor) => {
    const updatedPoints = [...points];
    updatedPoints[index].color = newColor;
    setPoints(updatedPoints);
    onPointsChange(updatedPoints);
  };

  return (
    <div>
      <img src={imageUrl} alt="Image" />
      {points.map((point, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: point.position.x,
            top: point.position.y,
            backgroundColor: point.color || 'red',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            cursor: 'move',
          }}
          draggable
          onDrag={(e) =>
            handlePointDrag(index, {
              x: e.clientX,
              y: e.clientY,
            })
          }
          onDragEnd={() => console.log('Drag ended')}
        >
          <input
            type="text"
            value={point.name}
            onChange={(e) => handlePointNameChange(index, e.target.value)}
          />
          <input
            type="text"
            value={point.tips}
            onChange={(e) => handlePointTipsChange(index, e.target.value)}
          />
          <input
            type="color"
            value={point.color}
            onChange={(e) => handlePointColorChange(index, e.target.value)}
          />
          <button onClick={() => handlePointDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default PointComponent;
