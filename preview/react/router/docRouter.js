import React from 'react';
import DocLayout  from 'layout/docLayout';
import AboutDoc from '../pages/doc/about'

const docRouter=[
    {
        path: '/',
        layout: DocLayout,
        component:AboutDoc
    },

]

export default docRouter;
