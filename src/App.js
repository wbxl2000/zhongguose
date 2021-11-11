import './App.css';
import * as React from 'react';
import { colorList } from './color.json';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';
import GitHub from '@material-ui/icons/GitHub';
import Fade from 'react-reveal/Fade';

function App() {
  // 处理原始数据
  let colorMap = new Map();
  colorList.forEach(item => {
    let type = item.name[item.name.length - 1];
    if (type === '色') type = item.name.substring(item.name.length - 2);
    const list = colorMap.get(type) || [];
    colorMap.set(type, [...list, item]);
  });

  var colorArray = Array.from(colorMap);
  colorArray.sort((a, b) => b[1].length - a[1].length);

  const [currentColor, setCurrentColor] = useState({
    "CMYK": [
      78,
      0,
      62,
      0
    ],
    "RGB": [
      93,
      190,
      138
    ],
    "hex": "#5dbe8a",
    "name": "蔻梢绿",
    "pinyin": "koushaolv"
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
          <div>
            <Button variant="outlined" size="small" onClick={() => copyText(currentColor?.hex, 'Hex 复制成功 ' + currentColor?.hex)}>
              {currentColor?.hex}
            </Button>
            <Button variant="outlined" size="small" onClick={() => copyText(currentColor?.RGB, 'RGB 复制成功 ' + currentColor?.RGB)}>
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
            <Button variant="text" style={{ marginLeft: '30px' }} onClick={() => copyText(JSON.stringify(chosenList), '所有候选颜色复制成功')}> 复制所有 </Button>
            <Button variant="text" onClick={() => setChosenList([])}> 清空 </Button>
          </div>
          <a href="https://github.com/wbxl2000/zhongguose" target="view_window"> <GitHub className="gitHub" /> </a>
        </div>
        <div className="chosen">
          {
            chosenList.map((item, index) => {
              return (
                <div className="color-select">
                  <Fade>
                    <div className="color-item" style={{
                      backgroundColor: item.hex,
                      height: '100px'
                    }} key={index} onClick={() => colorClick(item, true)}>
                    </div>
                  </Fade>
                  <Remove className="sub" onClick={() => delColor(index)} />
                </div>
              )
            })
          }
        </div>
        {/* 颜色导航区 */}
        <Fade>
          <div className="sub-nav">
            {
              colorArray.map(colorPair => {
                return (
                  <div className="type" key={colorPair[0]}>
                    <div className="type-name"> {colorPair[0]} </div>
                    <div className="type-item">
                      {
                        colorPair[1].map(item => {
                          return (
                            <div className="color-select">
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
        </Fade>
      </div>
    </div >
  );
}

export default App;