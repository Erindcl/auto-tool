#! /usr/bin/env node

const program = require('commander');
const colors = require('colors');  // 提示有颜色
const inquirer = require('inquirer');  // 终端文字提示 并获取交互信息

const add = require('../script/addResource.js');
const logs = console.log;
program
    .parse(process.argv);

try {
    let question = [{
        type: 'list',
        name: 'classify',
        message: '请选择新增类型',
        choices: [ 'block', 'component' ],
    }, {
        type: 'input',
        name: 'name',
        message: '请输入新增组件或区块名(以大驼峰法命名，如：UserLogin)',
    }, {
        type: 'input',
        name: 'nameC',
        message: '请输入新增组件或区块中文名',
    }, {
        type: 'input',
        name: 'category',
        message: '请输入新增组件或区块类别',
        default: "未分类",
    }]
    inquirer
        .prompt(question)
        .then((answers) => { 
            if (answers.name == '') {
                logs(colors.red('请输入组件名'));
            } else {
                answers.nameC = !answers.nameC || answers.nameC == '' ? answers.name : answers.nameC;
                // logs(answers)
                add(answers)
            }
        })
} catch (err) {
    logs(colors.red(err || '服务启动失败'));
}