import "./App.css";

import React, { useRef, useState, useEffect } from "react";
import CanvasLabeler from "./utils/canvasLabeler/index.ts";
import PointCanvas from "./components/PointCanvas/index";
import ImageWithPoints from "./components/ImageWithPoints/index";

import {
  Flex,
  Select,
  Button,
  Modal,
  Form,
  Input,
  ColorPicker,
  Table,
  Space,
  Tag,
  Col,
  Row,
} from "antd";

// import useLocalForage from "./utils/useLocalForage/index.js";

import img1 from "./assets/1.jpg";
import img2 from "./assets/2.jpg";
import img3 from "./assets/3.jpg";
import img4 from "./assets/4.jpg";
import img5 from "./assets/5.jpg";

function App() {
  const canvasRef = useRef(null);
  const labelerRef = useRef(null);

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [canvasRect, setCanvasRect] = useState({});
  const [componentRect, setComponentRect] = useState({});


  const [imgUrl, setImgUrl] = useState(img1);
  const [isFocusMode, setIsFocusMode] = useState(false);
  // const [dataStore, setDataStore] = useLocalForage("myData", {});
  const [dataList, setDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [info, setInfo] = useState({}); // 当前标注信息
  const [infoName, setInfoName] = useState(""); // 当前标注名称信息
  const [infoColor, setInfoColor] = useState("#666666"); // 当前标注颜色信息

  const [isPreview, setIsPreview] = useState(false);

  const [points, setPoints] = useState([
    { x: 100, y: 100, label: "Point 1", color: "red", tips: "This is point 1" },
    {
      x: 200,
      y: 150,
      label: "Point 2",
      color: "blue",
      tips: "This is point 2",
    },
    {
      x: 300,
      y: 200,
      label: "Point 3",
      color: "green",
      tips: "This is point 3",
    },
  ]);

  useEffect(() => {
    const componentRect =
      canvasRef.current.parentElement.getBoundingClientRect();
    setComponentRect(componentRect);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setCanvasRect(rect);
    const componentRect = canvas.parentElement.getBoundingClientRect();
    setComponentRect(componentRect);
    drawPoints();
  }, [points]);


  const drawPoints = () => {
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
console.log('0')
console.log(points)
    points.forEach((point) => {
      // Draw point
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = "black";
      ctx.font = "14px Arial";
      ctx.fillText(point.label, point.x + 10, point.y - 10);
    });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = points.find(
      (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 5
    );
    setHoveredPoint(point);
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        labelerRef.current = new CanvasLabeler(canvas, imgUrl);
        labelerRef.current.createType = 3;
        // 添加选中
        labelerRef.current.on("add", (info) => {
          console.log("info:::::", info);
          // todo
          setInfoName("");
          // 设置当前选中信息
          setInfo(JSON.parse(JSON.stringify(info)));
          setIsModalOpen(true);
        });
        // labelerRef.current.on("updated", (result) => {
        //   console.log(`%c------------------- updated result`,'background:#ccc')
        //   console.log(JSON.stringify(result))
        // });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imgUrl]);

  // 图片 标注 删除
  const delByIndex = (index) => {
    if (labelerRef.current) {
      labelerRef.current.deleteByIndex(index);
    }
  };

  // 图片 缩放
  const zoom = (type) => {
    if (labelerRef.current) {
      labelerRef.current.setScale(type);
    }
  };

  // 图片 自适应
  const fitting = () => {
    if (labelerRef.current) {
      labelerRef.current.fitZoom();
    }
  };

  // 图片 是否专注模式
  const onFocus = () => {
    if (labelerRef.current) {
      setIsFocusMode(!labelerRef.current.focusMode);
      labelerRef.current.setFocusMode(!labelerRef.current.focusMode);
    }
  };

  // 切换图片
  const handleImageChange = (value) => {
    switch (value) {
      case "1":
        labelerRef.current.setImage(img1);
        setImgUrl(img1);
        break;
      case "2":
        labelerRef.current.setImage(img2);
        setImgUrl(img2);
        break;
      case "3":
        labelerRef.current.setImage(img3);
        setImgUrl(img3);
        break;
      case "4":
        labelerRef.current.setImage(img4);
        setImgUrl(img4);
        break;
      case "5":
        labelerRef.current.setImage(img5);
        setImgUrl(img5);
        break;
      default:
        break;
    }
  };

  // 确定 列表添加数据
  const handleOk = () => {
    let infoNew = info;
    infoNew.name = infoName;
    infoNew.color = infoColor;
    infoNew.key = info.uuid;

    dataList.push(infoNew);
    setDataList(dataList);
    setIsModalOpen(false);
  };

  // 取消 取消标注 列表不添加数据
  const handleCancel = () => {
    delByIndex(info.index);
    setIsModalOpen(false);
  };

  // 删除
  const handleDelete = (item) => {
    delByIndex(item.index);
    const dataListNew = dataList.filter(
      (itemOld) => itemOld.index !== item.index
    );
    let dN = dataListNew;
    if (dataListNew && dataListNew.length > 0) {
      dN = dataListNew.map((item, index) => {
        let itemNew = item;
        itemNew.index = index;
        return itemNew;
      });
    }
    setDataList(dN);
    // setDataStore(dN);
  };

  const handlePreview = () => {
    const dataNew = dataList.map((item) => {
      let itemNew = {};
      // itemNew.x = item.coor[0];
      // itemNew.y = item.coor[1];
      itemNew.x = 100;
      itemNew.y = 100;
      itemNew.label = item.name;
      itemNew.color = item.color;
      itemNew.tips = item.name;
      return itemNew;
    });
    setPoints(dataNew);
    setIsPreview(!isPreview);
  };

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (index) => {
        return parseInt(index) + 1;
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name) => {
        return name;
      },
    },
    {
      title: "颜色",
      dataIndex: "color",
      key: "color",
      render: (color) => {
        return color;
      },
    },
    {
      title: "坐标",
      key: "coor",
      dataIndex: "coor",
      render: (_, { coor }) => (
        <>
          {coor.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const tableList = dataList ? [...dataList] : [];
  const pointsNew = points ? [...points] : [];
  return (
    <div className="App">
      <Flex gap="middle" vertical>
        <Flex>
          <div className="background-div">
            <canvas
              className="canvas"
              ref={canvasRef}
              width={800}
              height={600}
              onMouseMove={handleMouseMove}
            />
          </div>
          {isPreview && (
            <div className="overlay-div">
              <PointCanvas imgSrc={imgUrl} points={pointsNew} />
            </div>
          )}
        </Flex>
        <Flex wrap gap="small" align="center">
          <div className="row-label">图片切换:</div>
          <Select
            defaultValue="1"
            style={{ width: 120 }}
            onChange={handleImageChange}
            options={[
              { value: "1", label: "图片1" },
              { value: "2", label: "图片2" },
              { value: "3", label: "图片3" },
              { value: "4", label: "图片4" },
            ]}
          />
          <Button type="primary" onClick={() => zoom(true)}>
            +
          </Button>
          <Button type="primary" onClick={() => zoom(false)}>
            -
          </Button>
          <Button type="primary" onClick={fitting} autoInsertSpace>
            fitting
          </Button>
          <Button type="primary" onClick={onFocus} autoInsertSpace>
            {isFocusMode ? "专注模式" : "非专注模式"}
          </Button>
          <Button type="primary" onClick={handlePreview} autoInsertSpace>
            {isPreview ? "设计" : "预览"}
          </Button>
        </Flex>
        <Flex wrap gap="small" align="start">
          <Table columns={columns} dataSource={tableList} />
        </Flex>
        <Modal
          title="标注信息"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          cancelText="取消"
          okText="确定"
        >
          <Space direction="vertical">
            <Row>
              <Col span={6}>名称：</Col>
              <Col span={12}>
                <Input
                  value={infoName}
                  onChange={(e) => setInfoName(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>颜色：</Col>
              <Col span={12}>
                <ColorPicker
                  value={infoColor}
                  onChange={(c) => {
                    setInfoColor(c.toHexString());
                  }}
                  showText
                />
              </Col>
            </Row>
          </Space>
        </Modal>
      </Flex>
    </div>
  );
}
export default App;
