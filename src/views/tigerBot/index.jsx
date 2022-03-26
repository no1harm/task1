import React from "react";
import './index.css'
import { clone, round, shuffle } from 'lodash'
import { useMount, useSetState  } from 'ahooks'
import {  Button, Space } from 'antd';
import { useEffect } from "react";
import { map } from 'ramda'
import { useCallback } from "react";
import bot from '../../assets/images/bot.jpg'

export default function TigerBot() {
  const [state, setState] = useSetState({
    list: [],
    luckyNumber: undefined,
    round: 3,
    userExtras: 0,
    maxExtrasLimit: 2,
    resultShow: false,
    resultList: [],
    isFirst: true,
    loading:false
  })

  const generateRandomList = () => {
    const list =  new Array(state.round).fill(round).map(i => {
      return shuffle([...Array(100).keys()])
    })
    return list
  }

  useMount(() => {
    setState({ list: generateRandomList() })
  })

  const clearNodeAnimation = () => {
    const nodeList = state.list.map((item, index) => {
      const node = document.getElementById(`node${index}`).animate([])
      node.finish()
      return node
    })
  }

  const nodeAnimation = useCallback(() => {
    setState({loading:false})
    const nodeList = clone(state.list).map((item, index) => {
      const node = document.getElementById(`node${index}`).animate([
        {transform: 'translateY(0)'},
        {transform: 'translateY(calc(-100% + 60px))'},
      ], {
        fill: 'forwards',
        duration: 10000,
        delay: (index + 1 )* 1000,
        easing: 'ease-in-out'
      })
      node.play()
      if (index == 0) {
        setTimeout(() => {
          setState({resultShow:false})
        }, 1500)
      }
      return node
    })
    
    nodeList[nodeList.length - 1].onfinish = event => {
      setState({
        resultShow:true
      })
    }
  },[state.list])

  const generateResult = () => {
    const resultList = map((item) => {
      return item[item.length -1]
    }, state.list)
    setState({
      resultList
    })
  }

  useEffect(() => {
    if (state.list) {
      generateResult()
    }
  },[state.list])

  const replaceList = (list) => {
    return clone(state.list).map((item, index) => {
      return replaceListItem(item, list[index])
    },)
  }

  const replaceListItem = (list,key) => {
    const listx = [...list]
    const index = listx.findIndex((i) => i == key)
    listx.splice(index, 1)
    listx.push(key)
    return listx
  }

  const start = () => {
    if (state.isFirst) {
      setState({ list: replaceList([77,89,9]) })
      setTimeout(() => {
        nodeAnimation()
      })
      setState({isFirst:false})
    } else {
      setState({ list: generateRandomList(), loading: true })
      setState({ list: replaceList([66,66,99]) })
      setTimeout(() => {
        nodeAnimation()
      }, 1000)
    }
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
    <div className="botWrapper" style={{ margin: '20px 80px' }}>
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
      <div className="botContainer">
        <div className="bot">
          <img src={bot} alt="bot" />
          <div className="wrapper">
            {state.loading ? null : state.list.map((item,index) => {
              return <div key={index} className="container">
                <div className="pollContainer" id={`node${index}`}>
                  {item.map((i) => {
                    return (
                      <div className="contentWrapper" key={i}>
                        <h3 className="content">{ i}</h3>
                      </div>
                    )
                  })}
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
