import React, { useRef, useState, useEffect } from "react";
import "./index.css";

const InteractiveImage = ({ imgSrc, initialPoints = [], onSave }) => {
  const imageRef = useRef(null);
  const [points, setPoints] = useState(initialPoints);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleImageClick = (e) => {
    if (draggingIndex !== null) return; // Prevent adding point while dragging
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoint({ x, y, name: "", color: "red", tips: "" });
  };

  const handleInputChange = (e) => {
    setCurrentPoint({ ...currentPoint, [e.target.name]: e.target.value });
  };

  const handleSavePoint = () => {
    setPoints([...points, currentPoint]);
    setCurrentPoint(null);
  };

  const handleCancel = () => {
    setCurrentPoint(null);
  };

  const handleMouseDown = (index, e) => {
    const rect = imageRef.current.getBoundingClientRect();
    setDraggingIndex(index);
    setOffset({
      x: e.clientX - rect.left - points[index].x,
      y: e.clientY - rect.top - points[index].y,
    });
  };

  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const rect = imageRef.current.getBoundingClientRect();
    const newPoints = [...points];
    newPoints[draggingIndex] = {
      ...newPoints[draggingIndex],
      x: e.clientX - rect.left - offset.x,
      y: e.clientY - rect.top - offset.y,
    };
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
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
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingIndex, offset]);

  return (
    <div
      className="image-container"
      style={{ position: "relative", display: "inline-block" }}
    >
      <img
        ref={imageRef}
        src={imgSrc}
        alt="Interactive"
        style={{ display: "block", width: "100%" }}
        onClick={handleImageClick}
      />
      {points.map((point, index) => (
        <div
          key={index}
          className="point-container"
          style={{
            position: "absolute",
            top: point.y - 5,
            left: point.x - 5,
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
              borderRadius: "50%",
              cursor: "pointer",
            }}
          ></div>
          <div
            className="label"
            style={{ top: "-25px", left: "15px", cursor: "pointer" }}
          >
            {point.name}
          </div>
          {hoveredIndex === index && (
            <div className="tooltip" style={{ top: "-50px", left: "15px" }}>
              {point.tips}
            </div>
          )}
        </div>
      ))}
      {currentPoint && (
        <div
          className="input-container"
          style={{
            position: "absolute",
            top: currentPoint.y,
            left: currentPoint.x,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={currentPoint.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Color:
            <input
              type="color"
              name="color"
              value={currentPoint.color}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Tips:
            <input
              type="text"
              name="tips"
              value={currentPoint.tips}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSavePoint}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
      <button onClick={savePoints} style={{ marginTop: "10px" }}>
        Save Points
      </button>
    </div>
  );
};

export default InteractiveImage;
