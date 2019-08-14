import SecCompLayout  from 'layout/secCompLayout';
import UserLogin from 'component/user-login/src';
import UserReg from 'component/user-reg/src';

const routerConf = [
  { 
    path: '/component/user-reg',
    layout: SecCompLayout,
    component: UserReg,
  }, 
  { 
    path: '/component/user-login',
    layout: SecCompLayout,
    component: UserLogin,
  }, 
];

export default routerConf;
