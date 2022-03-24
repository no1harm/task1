import React from "react";
import './index.css'
import { shuffle } from 'lodash'
import { useSetState } from 'ahooks'
import {  Button, Space } from 'antd';
import { useEffect } from "react";

export default function TigerBot() {
  const [state, setState] = useSetState({
    list: [shuffle([...Array(100).keys()]), shuffle([...Array(100).keys()]), shuffle([...Array(100).keys()])],
    luckyNumber: undefined,
    round: 3,
    userExtras: 0,
    maxExtrasLimit: 2
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

  const replaceList = () => {
    if (state.userExtras > 0) {
      return state.list.map((item, index) => {
        if (index < state.userExtras) {
          return replaceListItem(item)
        } else {
          return item
        }
      })
    }
  }

  useEffect(() => {
    if (state.luckyNumber) {
      setState({list: replaceList()})
    }
  },[state.luckyNumber,state.userExtras])

  const start = () => {
    nodeAnimation()
  }

  const setLuckyNumber = () => {
    if (state.userExtras < state.maxExtrasLimit) {
      setState({luckyNumber: 77})
      setState({ userExtras: state.userExtras + 1})
    } else {
      console.log('limited!')
    }
  }

  const setUserExtras = () => {
    if (state.userExtras < state.maxExtrasLimit) {
      setState({luckyNumber: 88})
      setState({userExtras: state.userExtras + 1})
    } else {
      console.log('limited!')
    }
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
          <Button type="primary" onClick={() => setUserExtras()}>
            SET USER EXTRAS
          </Button>
        </Space>
      </div>
    </div>
  );
}
