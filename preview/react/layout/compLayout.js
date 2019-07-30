/*
 * @Description: 文件
 * @version: 1.0.0
 * @Company: 袋鼠云
 * @Author: Charles
 * @Date: 2018-12-28 19:08:08
 * @LastEditors: Charles
 * @LastEditTime: 2018-12-28 22:03:20
 */

import React, { Component } from 'react';
import MainLayout from './mainLayout'
export default class CompLayout extends Component {
  render() {
    return (
      <MainLayout {...this.props}>
           <iframe style={{border:0,width:"100%",height:630,}} src="https://dtux-kangaroo.github.io/ko-react/#/zh-CN/quick-start?type=source"/>
      </MainLayout>
    );
  }
}