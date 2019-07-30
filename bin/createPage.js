#! /usr/bin/env node

const program = require('commander');
const colors = require('colors');  // 提示有颜色
const inquirer = require('inquirer');  // 终端文字提示 并获取交互信息

const initR = require('../script/createPage.js');
const logs = console.log;
program
    .option('-t, --ts', '使用TS模版')
    .option('-p, --path', '自定义生成目录')
    .option('-u, --url', '自定义访问路径')
    .option('-l, --layout', '自定义布局')
    .parse(process.argv);

try {
    let question = [{
        type: 'Input',
        name: 'name',
        message: '请输入组件名(以大驼峰法命名，如：UserLogin)',
    }] 
    program.ts && question.push({
        type: 'Input',
        name: 'ts',
        message: '是否使用TS？(y/n)',
        default: 'y'
    })
    program.path && question.push({
        type: 'Input',
        name: 'path',
        message: '请输入生成目录(当前项目为根目录,默认为src/pages/)',
        default: 'src/pages/'
    })
    program.url && question.push({
        type: 'Input',
        name: 'url',
        message: '请输入访问路径(默认为当前项目名称，如：/user-login)',
        default: ''
    })
    program.layout && question.push({
        type: 'Input',
        name: 'layout',
        message: '请输入布局组件名(默认为：null)',
        default: 'null'
    })
    inquirer
        .prompt(question)
        .then((answers) => { 
            if (answers.name == '') {
                logs(colors.red('请输入组件名'));
            } else {
                answers.url = !answers.url || answers.url == '' ? '' : answers.url;
                answers.layout = !answers.layout ? 'null' : answers.layout;
                answers.path = !answers.path ? 'src/pages/' : answers.path;
                answers.ts = !answers.ts ? 'n' : answers.ts;
                initR(answers.name, answers.path, answers.url, answers.layout, answers.ts)
            }
        })
} catch (err) {
    logs(colors.red(err || '服务启动失败'));
}