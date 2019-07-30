#! /usr/bin/env node

const program = require('commander');
const colors = require('colors');  // 提示有颜色
const inquirer = require('inquirer');  // 终端文字提示 并获取交互信息
const { resolveApp } = require('../config/defaultPaths'); // 获取相对路径的绝对路径

const init = require('../script/createComp.js');
const logs = console.log;
program
    .option('-t, --ts', '使用TS模版')
    .option('-p, --path', '自定义生成目录')
    .parse(process.argv);

try {
    let question = [{
        type: 'Input',
        name: 'name',
        message: '请输入组件名(以大驼峰法命名，如：LoginIn)',
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
    inquirer
        .prompt(question)
        .then((answers) => { 
            if (answers.name == '') {
                logs(colors.red('请输入组件名'));
            } else {
                if(!answers.path || answers.path == ''){
                    answers.path = 'src/pages/';
                }
                answers.path = resolveApp(answers.path);
                answers.ts = !answers.ts ? 'n' : answers.ts;
                init(answers.name, answers.path, answers.ts)
            }
        })
} catch (err) {
    logs(colors.red(err || '服务启动失败'));
}