#!/usr/bin/env node

const clone = require('git-clone');
const { program } = require('commander');
const shell = require('shelljs');
const chalk = require('chalk')
const ora = require('ora');
const pka = require('../package.json');
const { execSync } = require('child_process')
const log = content => console.log(chalk.green(content))


const _execSync = async (...args) => {
  
  return new Promise(resolve => {
    const proc = execSync(...args)
  })
}

program
  .version(pka.version, '-v, --version')
  .command('* <project>').action((project) => {
  if (!project) {
    log.error('请指定项目名称');
    return;
  }
  const pwd = shell.pwd();
  const spinner = ora(
    `正在拉取模板代码，下载位置: ${pwd}/${project}/ ...`,
  ).start();
  clone(
    `https://github.com/augustaba/react-project-template.git`,
    `${pwd}/${project}`,
    null,
    async function (err) {
      if (err) {
        spinner.fail(err.message);
        return;
      }
      shell.rm('-rf', `${pwd}/${project}/.git`);
      spinner.succeed('下载成功');
      shell.cd(`${pwd}/${project}`);
      log('=====安装依赖=====')
      await _execSync('yarn', { stdio: 'inherit' })
      log(`
        =====安装完成=====
      `)
    },
  );
});
program.parse(process.argv);

