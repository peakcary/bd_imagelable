import React from 'react';
import PointCanvas from './components/PointCanvas/index';
import ImageLable from './components/ImageLable/index';

import img1 from './assets/1.jpg';

import './App.css'

const App = () => {
  const imgSrc = 'https://via.placeholder.com/600x400'; // 替换为你的图片URL
  const points = [
    { x: 100, y: 100, label: 'Point 1', color: 'red', tips: 'This is point 1' },
    { x: 200, y: 150, label: 'Point 2', color: 'blue', tips: 'This is point 2' },
    { x: 300, y: 200, label: 'Point 3', color: 'green', tips: 'This is point 3' }
  ];

  return (
    <div className="App">
      {/* <PointCanvas imgSrc={img1} points={points} /> */}
      <ImageLable />
    </div>
  );
};

export default App;
