import React, { Component } from 'react';
import MainLayout from './mainLayout'
import SideNav from '../components/sideNav'
import ScrollToTop from 'react-scroll-up';
import { sideData as SIDE_DATA} from '../constant/blockMenu';
export default class BlockLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
        sideData: SIDE_DATA
    };
}
  render() {
    const {sideData}=this.state;
    return (
      <MainLayout {...this.props}>
          <div className="main container">
              <SideNav data={sideData} {...this.props}></SideNav>
              <div className="content">
               <div className="block-content">
               {this.props.children}
               </div>
               <ScrollToTop showUnder={360}>
              <div className="page-component-up">
                <i className="el-icon-caret-top"></i>
              </div>
            </ScrollToTop>
            </div>
          </div>
      </MainLayout>
    );
  }
}