import React from "react";
import './index.css'
import { clone, round, shuffle } from 'lodash'
import { useMount, useSetState  } from 'ahooks'
import { Space,Drawer,Row,Col,message } from 'antd';
import { useEffect } from "react";
import { map } from 'ramda'
import { useCallback } from "react";
import bot from '../../assets/images/bot.jpg'
import { copyString } from '../../utils/index'

const winners = [{key:'0x164df54641...',value:0.05},{key:'0x67964sdf...',value:1.22},{key:'0x46974s6fs...',value:33.2}]
const players = ['0x164df54641...', '0x67964sdf...', '0x46974s6fs...']
const contacts = [
  { key: 'Twitter', value: 'https://twitter.com/no1harm', icon: 'twitter',shortName:'@no1harm' },
  { key: 'Github', value: 'https://github.com/no1harm', icon: 'github',shortName:'@no1harm' },
  { key: 'Gmail', value: 'mailto:chen09869@gmail.com', icon: 'gmail',shortName:'Gmail' },
  { key: 'Donate', value: '0x5100F54Ad9Fb0653327D523Cf62C30BD1543388a', icon: 'coin', shortName:'address' },
]

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
    loading: false,
    boardVisible: false
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
        {transform: 'translateY(calc(-100% + 55px))'},
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

  const loadingNode = (
    <div className="loadingCustom">
      <div className="bar">
        <div className="progress"></div>
      </div>
    </div>
  )

  const onClose = () => {
    setState({boardVisible:false})
  }

  const routeToMe = (value,key) => {
    if (key == 'Donate') {
      copyString(value)
      message.success(`Address: ${value} Copied!`);
      return
    }
    window.open(value)
  }
  
  return (
    <>
      <div className="botWrapper" style={{ margin: '20px 80px' }}>
        <div className="left">
          <div className="botContainer">
            <div className="bot">
              <img src={bot} alt="bot" />
              <div className="bgc"></div>
              <div className="wrapper">
                {state.loading ? loadingNode : state.list.map((item,index) => {
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
          <div className="btnWrapper">
            <Space>
              <button type="button" class="nes-btn is-primary" onClick={() => start()}>GO!</button>
              <button type="button" class="nes-btn is-primary" onClick={() => start()}>CONNECT</button>
            </Space>
          </div>
        </div>
        <div className="right">

          <div class="nes-container with-title is-centered bottom-margin">
            <p class="title">Pool</p>
            <p style={{textAlign:'left',fontSize:42}}><i class="nes-icon trophy is-medium"></i>180ETH</p>
          </div>

          <div class="nes-container with-title is-centered bottom-margin">
            <p class="title">What is it?</p>
            <p style={{textAlign:'left'}}>When you start the game, you get three random numbers generated by the smart contract</p>
            <p style={{textAlign:'left'}}>If the three numbers are the same</p>
            <p style={{textAlign:'left'}}>You win and you get all the prizes in the prize pool</p>
            <p style={{textAlign:'left'}}>That's ALL</p>
          </div>
          
          <div class="nes-container with-title is-centered bottom-margin">
            <p class="title">Buffs</p>
            <ul class="nes-list is-disc list-custom">
              <li>You can set extras</li>
              <li>This sets one of the random numbers to your desired lucky number</li>
              <li>Up to <span class="nes-text is-success">2</span> extras can be set</li>
            </ul>
          </div>

          <div class="nes-container with-title is-centered bottom-margin">
            <p class="title">Your Status</p>
            <ul class="nes-list is-disc list-custom">
              <li>Extras: <span class="nes-text is-success">0</span></li>
              <li>LuckyNumber: <span class="nes-text is-success">null</span></li>
              <li>WinRound: <span class="nes-text is-success">0</span></li>
              <li>Totol Play Round: <span class="nes-text is-success">0</span></li>
            </ul>
          </div>

          <div class="nes-container with-title is-centered bottom-margin">
            <p class="title">Increase Win Rate!</p>
            <button type="button" class="nes-btn is-primary" style={{marginBottom:10}} onClick={() => setUserExtras()}>SET YOUR EXTRAS!</button>
            <button type="button" class="nes-btn is-primary" onClick={() => setLuckyNumber()}>SET LUCKY NUMBER!</button>
          </div>
        </div>
        <div className="badges">
        <section class="icon-list">
          <a href="https://twitter.com/no1harm" className="icons-custom">
            <i class="nes-icon twitter is-medium"></i>
          </a>
          <a href="https://github.com/no1harm" className="icons-custom">
            <i class="nes-icon github is-medium"></i>
          </a>
          <a href="mailto:chen09869@gmail.com" className="icons-custom">
            <i class="nes-icon gmail is-medium"></i>
          </a>
        </section>
        </div>
      </div>
      <div className="boardBtn">
        <div><a onClick={() => {
          setState({boardVisible:true})
        }} className="nes-text is-primary">»</a></div>
      </div>
      <Drawer
        title="Board"
        placement="top"
        closable={false}
        onClose={onClose}
        visible={state.boardVisible}
        key="top"
        height={500}
      >
        <Row gutter={10}>
          <Col span={8}>
            <div class="nes-container with-title is-centered">
              <p class="title">Winners</p>
              <div class="lists borderItem">
                {map(item => {
                  return <div className="winner" key={item.key}>
                    <div><i class="nes-icon trophy is-small" style={{marginRight: '10px'}}></i>{item.key}</div>
                    <div>{item.value}</div>
                  </div>
                },winners)}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div class="nes-container with-title is-centered ">
              <p class="title">Players</p>
              <div class="lists borderItem">
                <ul class="nes-list is-disc list-custom">
                  {map(item => {
                    return <li key={item}>
                      {item}
                    </li>
                  },players)}
                </ul>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div class="nes-container with-title is-centered">
              <p class="title">About Me</p>
              <div class="lists borderItem">
                {map(item => {
                  return <div className="winner" key={item.key}>
                    <div><i class={`nes-icon ${item.icon} is-small`} style={{marginRight: '10px'}}></i>{item.key}</div>
                    <a target="_blank" onClick={()=>routeToMe(item.value,item.key)}><span class="nes-text is-success">{item.shortName}</span></a>
                  </div>
                },contacts)}
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
}
