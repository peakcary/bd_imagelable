import React, { useRef, useEffect, useState } from 'react';
import './index.css';

const PointCanvas = ({ imgSrc, points }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [canvasRect, setCanvasRect] = useState({});
  const [componentRect, setComponentRect] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setCanvasRect(rect);
    const componentRect = canvas.parentElement.getBoundingClientRect();
    setComponentRect(componentRect);
    drawPoints();
  }, [points]);

  useEffect(() => {
    const componentRect = canvasRef.current.parentElement.getBoundingClientRect();
    setComponentRect(componentRect);
  }, []);

  const drawPoints = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    points.forEach(point => {
      // Draw point
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillText(point.label, point.x + 10, point.y - 10);
    });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = points.find(p => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 5);
    setHoveredPoint(point);
  };

  return (
    <div className="point-canvas" style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseMove={handleMouseMove}
        style={{ background: `url(${imgSrc}) no-repeat center/cover` }}
      />
      {hoveredPoint && (
        <div
          className="tooltip"
          style={{
            top: canvasRect.top + hoveredPoint.y - 40 - componentRect.top + window.scrollY,
            left: canvasRect.left + hoveredPoint.x + 10 - componentRect.left + window.scrollX
          }}
        >
          {hoveredPoint.tips}
        </div>
      )}
    </div>
  );
};

export default PointCanvas;
