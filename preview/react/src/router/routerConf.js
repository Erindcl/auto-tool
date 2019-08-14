/*
 * @Description: 文件
 * @version: 1.0.0
 * @Company: 袋鼠云
 * @Author: Charles
 * @Date: 2018-12-26 12:00:39
 * @LastEditors: Charles
 * @LastEditTime: 2018-12-29 11:50:01
 */
import React from 'react';
import docRouter from './docRouter';
import blockRouter from './blockRouter';
import CompRouter from './compRouter';

import CompLayout  from 'layout/compLayout';
import Com from '../pages/com'

import ScaffoldsLayout  from 'layout/scaffoldsLayout';
import Scaffold from '../pages/scaffold'

import TemplateLayout  from 'layout/templateLayout';
import Template from '../pages/template'

import DownloadLayout from 'layout/downloadLayout';
import Download from '../pages/download'

//const prefix= process.env.NODE_ENV=='production'?'/react-block':''
const routerConf=[
    {
        path: '/com',
        layout: CompLayout,
        component:Com
    },

    {
        path: '/scaffold',
        layout: ScaffoldsLayout,
        component: Scaffold
    },
    {
        path: '/template',
        layout: TemplateLayout,
        component:Template
    },
    {
        path: '/download',
        layout: DownloadLayout,
        component:Download
    }
];
Array.prototype.push.apply(routerConf, docRouter);
Array.prototype.push.apply(routerConf, blockRouter);
Array.prototype.push.apply(routerConf, CompRouter);

export default routerConf;