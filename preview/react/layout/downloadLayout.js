import React, { Component } from 'react';
import MainLayout from './mainLayout'
export default class downloadLayout extends Component {
  render() {
    return (
      <MainLayout {...this.props}>
           {this.props.children}
      </MainLayout>
    );
  }
}