import React, { useRef, useEffect, useState } from 'react';
import './index.css';

const ImageWithPoints = ({ imgSrc, points }) => {
  const imageRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [imageRect, setImageRect] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageRect(imageRef.current.getBoundingClientRect());
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      setImageRect(imageRef.current.getBoundingClientRect());
    }
  }, [points]);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = points.find(p => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 5);
    setHoveredPoint(point);
  };

  return (
    <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imageRef}
        src={imgSrc}
        alt="Interactive"
        style={{ display: 'block', width: '100%' }}
        onMouseMove={handleMouseMove}
      />
      {points.map((point, index) => (
        <div
          key={index}
          className="point"
          style={{
            position: 'absolute',
            top: point.y - 5,
            left: point.x - 5,
            width: 10,
            height: 10,
            backgroundColor: point.color,
            borderRadius: '50%',
          }}
        ></div>
      ))}
      {hoveredPoint && (
        <div
          className="tooltip"
          style={{
            position: 'absolute',
            top: hoveredPoint.y - 40,
            left: hoveredPoint.x + 10,
            backgroundColor: 'yellow',
            padding: '5px',
            border: '1px solid black',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {hoveredPoint.tips}
        </div>
      )}
    </div>
  );
};

export default ImageWithPoints;
