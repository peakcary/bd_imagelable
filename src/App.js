import "./App.css";
import React, { useState } from "react";
import { ColorPicker, Table } from "antd";
import InteractiveImage from "./components/InteractiveImage/index";

import img1 from "./assets/1.jpg";

const App = () => {
  // 图片地址
  const [imgSrc] = useState(img1);
  // 坐标列表
  const [dataList, setDataList] = useState([]);

  const handleSave = (points) => {
    console.log("Saved points:", points);
    setDataList(points);
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "颜色",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <ColorPicker defaultValue={color} showText disabled size="small" />
      ),
    },
    {
      title: "原材料",
      dataIndex: "material",
      key: "material",
    },
    {
      title: "供应商",
      dataIndex: "com",
      key: "com",
    },
    {
      title: "提示信息",
      dataIndex: "tips",
      key: "tips",
    },
  ];

  return (
    <div className="App">
      <div className="container">
        <InteractiveImage
          imgSrc={imgSrc}
          initialPoints={dataList}
          onSave={handleSave}
        />
        <Table size="small" pagination={false} scroll={{ y: 400 }}  columns={columns} dataSource={dataList} />
      </div>
    </div>
  );
};

export default App;
