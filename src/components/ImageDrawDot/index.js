import React, { useRef, useState,useEffect } from 'react';
import './index.css';
import img1 from './assets/1.jpg';

const ImageDrawDot = () => {
  const canvasRef = useRef(null);
  // const [imgSrc] = useState('./assets/1.jpg'); // 这里替换为你的图片URL
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 开始绘制
    setIsDrawing(true);
    drawPoint(ctx, x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawPoint = (ctx, x, y) => {
    ctx.fillStyle = 'red'; // 设置绘制点的颜色
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI); // 绘制一个半径为5的圆
    ctx.fill();
  };


  const drawTip = (ctx, x, y, text) => {
    const padding = 10;
    const lineHeight = 20;

    // 设置样式
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.font = '16px Arial';

    // 计算文本宽度和高度
    const textWidth = ctx.measureText(text).width;
    const textHeight = lineHeight;

    // 绘制提示框
    ctx.fillRect(x, y - textHeight, textWidth + 2 * padding, textHeight + 2 * padding);
    ctx.strokeRect(x, y - textHeight, textWidth + 2 * padding, textHeight + 2 * padding);

    // 绘制文本
    ctx.fillStyle = 'black';
    ctx.fillText(text, x + padding, y - textHeight + padding + lineHeight / 2);
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red'; // 设置绘制点的颜色
    ctx.beginPath();
    ctx.arc(100, 100, 5, 0, 2 * Math.PI); // 绘制一个半径为5的圆
    ctx.fill();

    ctx.fillStyle = '#cccc'; // 设置标签颜色
    ctx.font = '20px Arial'; // 设置字体
    ctx.fillText('text', 101, 101); // 在指定位置绘制文本

    drawTip(ctx, 101, 101, 'aaaa');

  });

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ background: `url(${img1}) no-repeat center/cover` }}
      />
    </div>
  );
};

export default ImageDrawDot;
