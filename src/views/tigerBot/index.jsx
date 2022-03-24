import React from "react";
import './index.css'
import { shuffle } from 'lodash'
import { useMount, useSetState, useUpdateEffect } from 'ahooks'
import {  Button, Space } from 'antd';
import { useEffect } from "react";

export default function TigerBot() {
  const [state, setState] = useSetState({
    list: [shuffle([...Array(100).keys()]), shuffle([...Array(100).keys()]), shuffle([...Array(100).keys()])],
    luckyNumber: undefined
  })

  const replaceListItem = (list) => {
    if (state.luckyNumber) {
      const listx = [...list]
      const index = listx.findIndex((i) => i == state.luckyNumber)
      listx.splice(index, 1)
      listx.push(state.luckyNumber)
      return listx
    }
  }

  const nodeAnimation = () => {
    state.list.map((item,index) => {
      const node = document.getElementById(`node${index}`).animate([
        {transform: 'translateY(0)'},
        {transform: 'translateY(calc(-100% + 110px))'},
      ], {
        fill: 'forwards',
        duration: 10000,
        delay: (index + 1 )* 1000,
        easing: 'ease-in-out'
      })
      node.play()
    })
  }

  useEffect(() => {
    if (state.luckyNumber) {
      setState({list:state.list.map((item) => {
        return replaceListItem(item)
      })})
    }
  },[state.luckyNumber])

  const start = () => {
    nodeAnimation()
  }

  const setLuckyNumber = () => {
    setState({luckyNumber: 77})
  }
  
  return (
    <div style={{ margin: '20px 80px' }}>
      <div className="wrapper">
        {state.list.map((item,index) => {
          return <div key={index} className="container">
            <div className="pollContainer" id={`node${index}`}>
              {item.map((i) => {
                return (
                  <div className="contentWrapper" key={i}>
                    <h3 className="content">{i}</h3>
                  </div>
                )
              })}
            </div>
          </div>
        })}
      </div>
      <div className="btnWrapper">
        <Space>
          <Button type="primary" onClick={() => start()}>
            GO!
          </Button>
          <Button type="primary" onClick={() => setLuckyNumber()}>
            SET LUCKY NUMBER
          </Button>
        </Space>
      </div>
    </div>
  );
}
