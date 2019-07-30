const PAGE_TEMPLATE_PATH = '../template/pageTemplate.mustache';
const STYLE_TEMPLATE_PATH = '../template/styleTemplate.mustache';
const ROUTERTC_TEMPLATE_PATH = '../template/routerConfTemplate.mustache';
const INDEX_N = 'index.js';
const STYLE_N = 'style.scss';
const ROUTERTC_N = 'routerConf.js';

const ROUTERTC_N_TS = 'routerConf.tsx';
const INDEX_TS_N = 'index.tsx';
const PAGE_TS_TEMPLATE_PATH = '../template/pageTemplateTS.mustache';

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

function parseString (str) {  // 解析文件内已有字符串
  let tempArr = str.trim().split('const routerConf');
  let importedPks = tempArr[0].split('\n');
  importedPks = importedPks.filter((str) => {
    return str != '';
  })
  let oldConfArr = tempArr[1].split('[')[1].split(']')[0].replace(/\s/g,"");
  let reg = /(?<={).*?(?=})/g;
  let oldConfData = [];
  oldConfArr = oldConfArr.match(reg);
  oldConfArr.forEach(element => {
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

function mergeRouterCData (path, newData) { // 合并新旧数据
  let fileData = {};
  if (existsSync(path)) {
    let fileContent = readFileSync(path);
    fileContent = parseString(fileContent);
    // 判断布局文件是否已被导入
    let isExist = false; 
    for (let i = 0, length = fileContent.confData.length; i < length; i++) {
      isExist = fileContent.confData[i].layoutName == newData.confData[0].layoutName ? true : false;
      if (isExist) {
        break;
      }
    }
    fileData = {
      importPackages: isExist ? [ ...fileContent.importPackages, newData.importPackages[0] ] : [ ...fileContent.importPackages, ...newData.importPackages ],
      confData: [ ...newData.confData, ...fileContent.confData ],
    }
  } else {
    fileData = newData
  }
  return fileData;
}

module.exports = (compName, compPath, url, layoutName, isTs) => {
  const folderName = toCamel(compName);  // 文件夹名称
  const className = toLine(compName);  // 类名
  const folderPath = `${resolveApp(compPath)}/${folderName}`;
  const folderExist = existsSync(folderPath); //文件夹是否存在

  let layoutPath = '', 
      layoutExist = true, 
      importPackages = [`import ${compName} from '../../${compPath}${folderName}';`];
  if (layoutName != 'null') {
    layoutPath = resolveApp('src/layout');
    layoutPath = `${layoutPath}/${toCamel(layoutName)}`;
    layoutExist = existsSync(layoutPath); 
    importPackages.push(`import ${layoutName} from '../../src/layout/${toCamel(layoutName)}';`)
  }

  if (folderExist) {
    Log(Colors.red(`指定路径下组件已存在，请重新输入组件名`));
  } else if (!layoutExist) {
    Log(Colors.red(`布局组件不存在，请重新输入布局组件名`));
  } else {
    // 生成文件
    mkdir(folderPath);
    const indexContent = renderMustache(isTs == 'y' ? PAGE_TS_TEMPLATE_PATH : PAGE_TEMPLATE_PATH, {
      name: compName,
      className
    });
    const styleContent = renderMustache(STYLE_TEMPLATE_PATH, {
      className
    });
    writerFile(Path.join(folderPath, isTs == 'y' ? INDEX_TS_N : INDEX_N), indexContent);
    writerFile(Path.join(folderPath, STYLE_N), styleContent);

    // 配置路由
    const newConf = {
      importPackages,
      confData: [{
        linkPath: url == '' ? `/${className}` : url,
        layoutName,
        compName
      }]
    }
    const routerCPath = resolveApp(isTs == 'y' ? `src/router/${ROUTERTC_N_TS}` : `src/router/${ROUTERTC_N}`)
    const allRouterConf = mergeRouterCData(routerCPath,newConf);
    const routerConfContent = renderMustache(ROUTERTC_TEMPLATE_PATH, allRouterConf);
    writerFile(routerCPath, routerConfContent);
  }
}

