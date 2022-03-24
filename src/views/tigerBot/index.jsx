import React from "react";
import './index.css'
import { shuffle } from 'lodash'
import { useMount, useUpdateEffect } from 'ahooks'
import { useState } from "react";

export default function TigerBot() {
  const [list, setList] = useState([shuffle([...Array(100).keys()]),shuffle([...Array(100).keys()]),shuffle([...Array(100).keys()])])
  useMount(() => {
    setList(list.map((item) => {
      return replaceListItem(item,66)
    }))
  })

  useUpdateEffect(() => {
    nodeAnimation()
  },list)

  const replaceListItem = (list, key) => {
    const listx = [...list]
    const index = listx.findIndex((i) => i == key)
    listx.splice(index, 1)
    listx.push(key)
    return listx
  }

  const nodeAnimation = () => {
    const node0 = document.getElementById('node0').animate([
      {transform: 'translateY(0)'},
      {transform: 'translateY(calc(-100% + 110px))'},
    ], {
      fill: 'forwards',
      duration: 10000,
      delay: 1000,
      easing: 'ease-in-out'
    })

    const node1 = document.getElementById('node1').animate([
      {transform: 'translateY(0)'},
      {transform: 'translateY(calc(-100% + 110px))'},
    ], {
      fill: 'forwards',
      duration: 10000,
      delay: 2000,
      easing: 'ease-in-out'
    })

    const node2 = document.getElementById('node2').animate([
      {transform: 'translateY(0)'},
      {transform: 'translateY(calc(-100% + 110px))'},
    ], {
      fill: 'forwards',
      duration: 10000,
      delay: 3000,
      easing: 'ease-in-out'
    })

    node0.play()
    node1.play()
    node2.play()
  }
  
  return (
    <div style={{ margin: '20px 80px' }}>
      <div className="wrapper">
        {list.map((item,index) => {
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
    </div>
  );
}
