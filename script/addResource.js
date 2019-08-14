const MENUD_TEMPLATE_PATH = '../template/menuDataTemplate.mustache';
const INDEX_TEMPLATE_PATH = '../template/indexTemplate.mustache';
const PACKAGE_TEMPLATE_PATH = '../template/packageTemplate.mustache';
const PAGE_TEMPLATE_PATH = '../template/pageTemplate.mustache';
const ROUTERTC_TEMPLATE_PATH = '../template/routerConfTemplate.mustache';

const INDEX_N = 'index.js';
const BLOCK_MD_N = 'blockMenu.js';
const COMP_MD_N = 'compMenu.js';
const BLOCK_RC_N = 'blockRouter.js';
const COMP_RC_N = 'compRouter.js';
const PACKAGE_N = 'package.json';
const README_N = 'README.md';

const Colors = require('colors');
const Log = console.log;
const fs = require('fs');
const Mustache = require('mustache');
const Path = require('path');

const { resolveApp } = require('../config/defaultPaths');
const { existsSync, mkdir, readFileSync } = require('../util/fileService');

function toLine (str) { // 大驼峰转连字符 loginIn -> login-in
	var temp = str.replace(/[A-Z]/g, function (match) {	
		return "-" + match.toLowerCase();
  });
  if(temp.slice(0,1) === '-'){ 
  	temp = temp.slice(1);
  }
	return temp;
}

function toCamel (str) { // 大驼峰转小驼峰 首字母转为小写
  return str[0].toLowerCase() + str.substring(1)
}

function writerFile (filePath, renderString) { // 生成指定文件并填入内容
  fs.writeFile(filePath, renderString, function (err) {
    if (err)
      Log(Colors.red('生成操作失败'));
    else
      Log(Colors.green(`生成操作成功,生成目录: ${filePath} `));
  });
}

function renderMustache (path, data) { // 渲染获取字符串
  let temp = fs.readFileSync(require.resolve(path), "utf-8").toString();
  let renderString = Mustache.render(temp, data);
  return renderString;
}

function parseString (str) {  // 解析路由文件内已有字符串
  let tempArr = str.trim().split('const routerConf');
  let importedPks = tempArr[0].split('\n');
  importedPks = importedPks.filter((str) => {
    return str != '';
  })
  let oldConfArr = tempArr[1].split('[')[1].split(']')[0].replace(/\s/g,"");
  let reg = /(?<={).*?(?=})/g;
  let oldConfData = [];
  oldConfArr = oldConfArr.match(reg);
  oldConfArr && oldConfArr.forEach(element => {
    let tempObj = {}, 
        tempArr = element.split(',').filter((str) => {
          return str != '';
        });
    tempArr.forEach(str => {
      tempObj[str.split(':')[0]] = str.split(':')[1];
    })
    oldConfData.push({
      linkPath: tempObj.path.split('\'')[1],
      layoutName: tempObj.layout,
      compName: tempObj.component,
    });
  });
  return {
    importPackages: importedPks,
    confData: oldConfData
  }
}

function mergeRouterCData (path, newData) { // 合并路由新旧数据
  let fileData = {};
  if (existsSync(path)) {
    let fileContent = readFileSync(path);
    fileContent = parseString(fileContent);
    fileData = {
      importPackages: [ ...fileContent.importPackages, ...newData.importPackages ],
      confData: [ ...newData.confData, ...fileContent.confData ],
    }
  } else {
    fileData = newData
  }
  return fileData;
}

function parseOldMenuData (str) {
  let sideData = str.split("default")[1].replace(/\s/g,"");
  sideData = eval("("+sideData+")").sideData ? eval("("+sideData+")").sideData : [];
  return sideData;
}
function mergeMenuData (path, newData) { // 合并菜单新旧数据
  let fileData = {};
  if (existsSync(path)) {
    let fileContent = readFileSync(path);
    fileContent = parseOldMenuData(fileContent);
    let categoryArr = [];
    fileContent.forEach((item) => {
      categoryArr.push(item.name)
    })
    let catIndex = categoryArr.indexOf(newData.name);
    if (catIndex != -1) {
      fileContent[catIndex].children.push(...newData.children)
    } else {
      fileContent.push(newData)
    }
    fileData = {
      menuData: fileContent
    }
  } else {
    fileData = {
      menuData: newData
    }
  }
  return fileData;
}

module.exports = (params) => {
  const { classify, name, nameC, category } = params;
  const fileName = toCamel(name);  // 文件名称
  const linkPath = toLine(name);  // 路径名
  const folderPath = `${resolveApp('react-resource')}/${classify}s/${linkPath}`;
  const folderExist = existsSync(folderPath); //文件夹是否存在

  let importPackages = [`import ${name} from '${classify}/${linkPath}/src';`];
  
  if (folderExist) {
    Log(Colors.red(`指定路径下组件或区块已存在，请重新输入组件或区块名`));
  } else {
    // 生成基础文件
    mkdir(folderPath);
    mkdir(`${folderPath}/src`);
    const indexContent = renderMustache(INDEX_TEMPLATE_PATH, {
      name,
      fileName
    });
    const realContent = renderMustache(PAGE_TEMPLATE_PATH, {
      className: linkPath,
      name,
    });
    const packageContent = renderMustache(PACKAGE_TEMPLATE_PATH, {
      path: linkPath,
      classify,
      nameC,
      category,
    });
    writerFile(Path.join(folderPath, PACKAGE_N), packageContent);
    writerFile(Path.join(folderPath, README_N), '');
    writerFile(Path.join(`${folderPath}/src`, INDEX_N), indexContent);
    writerFile(Path.join(`${folderPath}/src`, `${fileName}.jsx`), realContent);

    // 配置路由
    const newConf = {
      importPackages,
      confData: [{
        linkPath: `/${classify}/${linkPath}`,
        layoutName: classify == 'block' ? 'BlockLayout' : 'SecCompLayout' ,
        compName: name
      }]
    }
    const routerCPath = resolveApp( `preview/react/src/router/${classify == 'block' ? BLOCK_RC_N : COMP_RC_N}`)
    const allRouterConf = mergeRouterCData(routerCPath,newConf);
    const routerConfContent = renderMustache(ROUTERTC_TEMPLATE_PATH, allRouterConf);
    writerFile(routerCPath, routerConfContent);

    // 配置菜单
    const newMenuData = {
      name: category,
      path: '',
      children: [{
        name: nameC,
        path: `/${classify}/${linkPath}`
      }]
    };
    const menuDataPath = resolveApp( `preview/react/src/constant/${classify == 'block' ? BLOCK_MD_N : COMP_MD_N}`)
    const allMenuData = mergeMenuData(menuDataPath,newMenuData);
    const menuDataContent = renderMustache(MENUD_TEMPLATE_PATH, allMenuData);
    writerFile(menuDataPath, menuDataContent);
  }
}

