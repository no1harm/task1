import React from "react";
import './index.css'
import { clone, round, shuffle } from 'lodash'
import { useMount, useSetState  } from 'ahooks'
import { Space,Drawer,Row,Col,message,Modal,Button } from 'antd';
import { useEffect } from "react";
import { isEmpty, isNil, map } from 'ramda'
import { useCallback } from "react";
import bot from '../../assets/images/bot.jpg'
import { copyString } from '../../utils/index'
import abi from "./abi/TigerBot.json";
import { ethers } from "ethers";
const contractAbi = abi.abi
const contractAddress = '0xa06D778a192CAfbB8592faFe0A8A8e9f147C2b02'

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
    boardVisible: false,
    currentAccount: '',
    modalVisible:false
  })

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        message.info(`${account} connected`)
        setState({currentAccount:account})
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      message.info(`${accounts[0]} connected`)
      setState({currentAccount:accounts[0]})
    } catch (error) {
      console.log(error)
    }
  }

  const generateRandomList = () => {
    const list =  new Array(state.round).fill(round).map(i => {
      return shuffle([...Array(100).keys()])
    })
    return list
  }

  const checkContract = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const { chainId } = await provider.getNetwork()
        if(chainId != '4'){
          setState({ modalVisible:true })
          throw('wrong network')
        }
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useMount(() => {
    setState({ list: generateRandomList() })
  })

  useEffect(async() => {
    if (!state.currentAccount) {
      checkIfWalletIsConnected();
    }
    checkContract()
  }, [state.currentAccount])

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

  const handleOk = async ()=>{
    const data = await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    });
    if(!data){
      window.location.reload()
    }
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
              {isNil(state.currentAccount) || isEmpty(state.currentAccount)
                ? <button type="button" class="nes-btn is-primary" onClick={() => connectWallet()}>CONNECT</button>
                : <button type="button" class="nes-btn is-primary" onClick={() => start()}>GO!</button>
              }
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
                <ul class="nes-list is-disc">
                  {map(item => {
                    return <li key={item} style={{textAlign:'left'}}>
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
      <Modal title="Warning" visible={state.modalVisible} cancelText=""footer={[<Button onClick={handleOk} type="primary" >Switch</Button>]} closable={false}>
        <p>Please Switch to Rinkeby</p>
      </Modal>
    </>
  );
}
