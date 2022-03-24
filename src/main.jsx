import * as React from "react";
import * as ReactDOM from "react-dom";
import "./App.css"
import { BrowserRouter,Routes, Route } from "react-router-dom";
import './index.css'
import 'antd/dist/antd.css';
import Task1 from "./views/task1/index.jsx";
import TigerBot from "./views/tigerBot/index.jsx";
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="task1" element={<Task1 />} />
          <Route path="tigerBot" element={<TigerBot />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
