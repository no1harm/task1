import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
// const contractAddress = "0x16A3137947773Db862fFc537Ce3A1feD4e895A49"
const contractAddress = '0x03c9eEb38583Ae082e90AE82c41b095E0188e193';
// import abi from "./utils/WavePortal.json";
import { Steps, Button, message, Statistic, Row, Col, } from 'antd';
const { Step } = Steps;
import abi from "./utils/Task.json";
const contractABI = abi.abi
const tokenAddress = '0x03c9eEb38583Ae082e90AE82c41b095E0188e193'
function randomString(e) {    
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return 'random massage' + n
}
const steps = [
  {
    title: 'Claim',
    content: 'First-content',
  },
  {
    title: 'Mint',
    content: 'Second-content',
  },
  {
    title: 'Done',
    content: 'Last-content',
  },
];

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [current, setCurrent] = useState(0);
  const [claimed, setClaimed] = useState(false)
  const [totalToken, setTotalToken] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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
        setCurrentAccount(account)
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
      console.log('accounts ====>',accounts)
      message.info(`${account} connected`)
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const checkContract = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const totalSupply = await taskTokenContract.totalSupply()
        const isClaimed = currentAccount ? await taskTokenContract.isClaimed(currentAccount) : false
        setClaimed(isClaimed)
        setTotalToken(ethers.utils.formatUnits(totalSupply,18))
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!currentAccount) {
      checkIfWalletIsConnected();
    }
    checkContract()
  }, [currentAccount])
  

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(randomString(10));
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const claim = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log('taskTokenContract',taskTokenContract)
        // const task = await taskTokenContract.getAllWaves();
        const totalSupply = await taskTokenContract.totalSupply
        const isClaimed  = await taskTokenContract.isClaimed(currentAccount)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
        getAllWaves()
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div style={{ margin: '20px 80px' }}>
      {currentAccount && <div className="display-right">
        <Button>{ currentAccount + ' connected'}</Button>
      </div>}
      <Row gutter={16} style={{marginBottom: '50px'}}>
        <Col span={6}>
          <Statistic title="Token Total Supply" value={totalToken} />
        </Col>
        <Col span={6}>
          <Statistic title="NFT Total Supply" value={112893} />
        </Col>
        <Col span={6}>
          <Statistic title="Total Minted NFT" value={112893} />
        </Col>
        <Col span={6}>
          <Statistic title="Your Claimed Token" value={claimed ? 50 : 0} />
        </Col>
      </Row>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        {current == 0 &&
          <>
            {!currentAccount && (
              <Button onClick={connectWallet}>
                Connect Wallet
              </Button>
          )}
          <Button disabled={claimed} onClick={claim}>
            {claimed ? 'Claimed' : 'Claim'}
          </Button>
          </>}
      </div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}
