import React from 'react';
import InteractiveImage from './components/InteractiveImage/index';
import './App.css';
// import 'antd/dist/antd.css';

import img1 from './assets/1.jpg'

const App = () => {
  const imgSrc = img1; // 替换为你的图片URL
  const initialPoints = [
    { x: 100, y: 100, color: 'red', name: 'Point 1', tips: 'This is point 1' },
    { x: 200, y: 150, color: 'blue', name: 'Point 2', tips: 'This is point 2' },
    { x: 300, y: 200, color: 'green', name: 'Point 3', tips: 'This is point 3' }
  ];

  const handleSave = (points) => {
    console.log('Saved points:', points);
  };

  return (
    <div className="App">
      <div style={{width:800,height:600}}>
      <InteractiveImage imgSrc={imgSrc} initialPoints={initialPoints} onSave={handleSave} />
      </div>
     
    </div>
  );
};

export default App;
