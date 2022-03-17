import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
// const contractAddress = "0x16A3137947773Db862fFc537Ce3A1feD4e895A49"
const contractAddress = '0x6cB075BC3151F7fdaD6a9841AeDF54219a6720f6';
const nftContractAddress = '0x54F64346F496e653Aa161F227b5d0e497FFAE841'
// import abi from "./utils/WavePortal.json";
import { Steps, Button, message, Statistic, Row, Col, Result } from 'antd';
const { Step } = Steps;
import abi from "./utils/Task.json";
import nftAbi from "./utils/TASKNFT.json";
import { useMemo } from "react";
const tokenContractABI = abi.abi
const nftContractABI = nftAbi.abi
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
  const [claimedLoading, setClaimedLoading] = useState(false);
  const [minted,setMinted] = useState(false)
  const [totalNft,setTotalNft] = useState(0)
  const [mintedNft,setMintedNft] = useState(0)

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
      message.info(`${accounts[0]} connected`)
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const checkTokenContract = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskTokenContract = new ethers.Contract(contractAddress, tokenContractABI, signer);
        const totalSupply = await taskTokenContract.totalSupply()
        const isClaimed = currentAccount ? await taskTokenContract.isClaimed(currentAccount) : false
        // const approve = await taskTokenContract.approve(currentAccount, 50)
        setClaimed(isClaimed)
        setCurrent(isClaimed ? 1 : 0)
        setTotalToken(ethers.utils.formatUnits(totalSupply,18))
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkNftContract = async ()=>{
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskNftContract = new ethers.Contract(nftContractAddress, nftContractABI, signer);
        const supply = await taskNftContract.MAX_SUPPLY();
        const totalMinted = await taskNftContract.checkTotalMined();
        const isMinted = currentAccount ? await taskNftContract.numberMinted(currentAccount) : false
        const mintNumber = ethers.utils.formatUnits(isMinted || 0, 18)
        isMinted && setMinted(mintNumber !== '0.0')
        setCurrent(mintNumber !== '0.0' ? 2 : (claimed ? 1 : 0))
        setTotalNft(supply.toString())
        setMintedNft(totalMinted.toString())
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
    checkTokenContract()
    checkNftContract()
  }, [currentAccount])

  const claim = async () => {
    try {
      setClaimedLoading(true)
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log('signer==>', signer)
        const taskTokenContract = new ethers.Contract(contractAddress, tokenContractABI, signer);
        // await taskTokenContract.approve(currentAccount, (50 * 10 ** 18).toString())
        const claimTxn = await taskTokenContract.claim()
        console.log("Mining...", claimTxn.hash);
        await claimTxn.wait();
        checkTokenContract()
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    } finally {
      setClaimedLoading(false)
    }
  }

  const mint = async ()=>{
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskNftContract = new ethers.Contract(nftContractAddress, nftContractABI, signer);
        try {
          const taskTokenContract = new ethers.Contract(contractAddress, tokenContractABI, signer);
          await taskTokenContract.approve(nftContractAddress, ethers.utils.parseEther('50'))
        } catch (error) {
          console.log('token approve error ===>',error)
          return          
        }
        const mint = await taskNftContract.mint(ethers.utils.parseEther('1'));
        console.log("Mining...", mint.hash);
        await mint.wait();
        setMinted(true)
        checkNftContract()
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    } finally {
      setClaimedLoading(false)
    }
  }

  const currentDisable = useMemo(() => {
    if (current == 0 && !claimed) {
      return true
    }
    if (current == 1 && !minted) {
      return true
    }
    return false
  },[current, claimed, minted])
  
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
          <Statistic title="NFT Total Supply" value={totalNft} />
        </Col>
        <Col span={6}>
          <Statistic title="Total Minted NFT" value={mintedNft} />
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
        {!currentAccount && (
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
        {current == 0 &&
          <>
            {currentAccount && <Button disabled={claimed} loading={claimedLoading} onClick={claim}>
              {claimed ? 'Claimed' : 'Claim'}
            </Button>}
          </>
        }
        {
          current == 1 && 
          <>
            {currentAccount && <Button disabled={minted} loading={claimedLoading} onClick={mint}>
              {minted ? 'Minted' : 'Mint'}
            </Button>}
          </>
        }
        {
          current == 2 && 
          <>
            {currentAccount &&
              <Result
                status="success"
                title="Successfully Minted Your NFTs!"
                subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
              />
            }
          </>
        }
      </div>
      <div className="steps-action">
      {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button disabled={currentDisable} type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
