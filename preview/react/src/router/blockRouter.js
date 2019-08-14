import BlockLayout  from 'layout/blockLayout';
import About from 'block/about/src'
 //brand-display
 import BrandDisplay from 'block/brand-display/src'
import ChartPie from 'block/chart-pie/src'
import NotFound from 'block/not-found/src'

const routerConf = [
    {
        path: '/block',
        layout: BlockLayout,
        component:BrandDisplay
    },
    {
        path: '/block/about',
        layout: BlockLayout,
        component:About
    },
    {
        path: '/block/chart-pie',
        layout: BlockLayout,
        component:ChartPie
    },
    {
        path: '/block/not-found',
        layout: BlockLayout,
        component: NotFound
    }
]

export default routerConf;
