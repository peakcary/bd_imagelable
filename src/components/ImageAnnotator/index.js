import "./index.css";

import React, { useRef, useState, useEffect } from "react";

function ImageAnnotator() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvasRef.current.getContext("2d");
      // 加载图片
      const image = new Image();
      image.src = "./assets/1.jpg";
      image.onload = () => {
        context.drawImage(
          image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      };
    }
  });

  return (
    <>
      <canvas ref={canvasRef} width={500} height={500} />
    </>
  );
}
export default ImageAnnotator;
