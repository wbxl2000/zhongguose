import './App.css';
import * as React from 'react';
import { colorList } from './color.json';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';

function App() {
  // 处理原始数据
  // 初始化颜色分类
  const classify = ['红', '绿', '黄', '灰', '紫', '蓝', '棕', '白', '青', '橙', '粉', '褐', '肉色', '驼', '咖啡', '豆沙', '米色'];
  const classify_other = [];

  let colorMap = new Map();
  colorList.forEach(item => {
    let is_other = true;
    for (let i = 0; i < classify.length; i++) {
      if (item.name.indexOf(classify[i]) !== -1) {
        const list = colorMap.get(classify[i]) || [];
        colorMap.set(classify[i], [...list, item]);
        is_other = false;
      }
    }
    (is_other) && classify_other.push(item);
  });
  let colorArray = Array.from(colorMap).sort((a, b) => b[1].length - a[1].length);
  colorArray.push(['其他', classify_other]);

  const [currentColor, setCurrentColor] = useState({
    CMYK: [78, 0, 62, 0],
    RGB: [93, 190, 138],
    hex: "#5dbe8a",
    name: "蔻梢绿",
    pinyin: "koushaolv"
  });
  const [chosenList, setChosenList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [successType, setSuccessType] = React.useState('success');

  function colorClick(item, chosen = false) {
    console.log(item);
    setCurrentColor(item);
    if (!chosen) {
      setChosenList([...chosenList, item]);
    }
  }

  function delColor(index) {
    const list = [...chosenList];
    list.splice(index, 1);
    setChosenList(list);
  }

  async function copyText(text, successText) {
    function information(type, msg) {
      console.log(msg);
      setSuccessType(type);
      setMessage(msg);
      setOpen(true);
      setTimeout(() => setOpen(false), 2000);
    }
    try {
      await navigator.clipboard.writeText(text);
      information('success', successText);
    } catch (err) {
      information('error', `复制失败:  ${err}`);
    }
  }

  return (
    <div className="container">
      {/* 消息通知条 */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={() => setOpen(false)}
        style={{ marginRight: '20px', marginTop: '-10px' }}
      >
        <Alert severity={successType}>{message}</Alert>
      </Snackbar>
      {/* 左半区 */}
      <div className="half">
        <div className="header">
          <div className="type-name">
            {currentColor?.name}
          </div>
          <div className="buttons">
            <Button style={{ marginRight: '10px' }} variant="outlined" size="small" onClick={() => copyText(currentColor?.hex, 'Hex 复制成功 ' + currentColor?.hex)}>
              {/* {currentColor?.hex} */}
              Hex
            </Button>
            <Button style={{ marginRight: '10px' }} variant="outlined" size="small" onClick={() => copyText(currentColor?.RGB, 'RGB 复制成功 ' + currentColor?.RGB)}>
              RGB
            </Button>
            <Button variant="outlined" size="small" onClick={() => copyText(currentColor?.CMYK, 'CMYK 复制成功 ' + currentColor?.CMYK)}>
              CMYK
            </Button>
          </div>
        </div>
        <div className="color-canvas" style={{ backgroundColor: currentColor?.hex }}>
        </div>
      </div>
      {/* 右半区 */}
      <div className="half nav">
        <div className="header">
          <div className="function-buttons">
            <div className="type-name"> 候选区域 </div>
            <Button style={{ marginRight: '10px' }} variant="text" size="small" onClick={() => copyText(JSON.stringify(chosenList), '所有候选颜色复制成功')}> 复制所有 </Button>
            <Button variant="text" size="small" onClick={() => setChosenList([])}> 清空 </Button>
          </div>
        </div>
        <div className="chosen">
          {
            chosenList.map((item, index) => {
              return (
                <div className="color-select" key={item.pinyin}>
                  <div className="color-item" style={{
                    backgroundColor: item.hex,
                    height: '100px'
                  }} onClick={() => colorClick(item, true)}>
                  </div>
                  <Remove className="sub" onClick={() => delColor(index)} />
                </div>
              )
            })
          }
        </div>
        {/* 颜色导航区 */}
        <div className="sub-nav">
          {
            colorArray.map(colorPair => {
              return (
                <div className="type" key={colorPair[0]}>
                  <div className="type-header">
                    <div className="type-name"> {colorPair[0]} </div>
                  </div>
                  <div className="type-item">
                    {
                      colorPair[1].map(item => {
                        return (
                          <div className="color-select" key={item.name}>
                            <div className="color-item" style={{
                              borderTop: `10px solid ${item.hex}`
                            }} key={item.name} onClick={() => colorClick(item, true)}>
                              {item.name}
                            </div>
                            <Add className="add" onClick={() => colorClick(item)} />
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div >
  );
}

export default App;