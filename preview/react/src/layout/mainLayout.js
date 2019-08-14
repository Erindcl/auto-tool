import React, { Component } from 'react';
import Header from 'components/header'
import Footer from 'components/footer'
export default class MainLayout extends Component {
    constructor(props) {
        super(props);
    }

  render() {
      console.log(this.props,';;kl;l');
    return (
      <div style={{ minHeight: '100vh' }} className="ko-app">
        <Header {...this.props}/>
        {this.props.children}
        <Footer/>
      </div>
    );
  }
}