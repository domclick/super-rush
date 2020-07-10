/**
 * Copyright Ⓒ 2020 Sberbank Real Estate Centre Limited Liability Company. Licensed under the MIT license.
 * Please, see the LICENSE.md file in project's root for full licensing information.
 */

import {
  dirname,
  relative as relativePath,
  resolve as resolvePath

} from 'path';

import chalk from 'chalk';

import { loadSuperRushConfigOrThrow, superRushConfigName } from './super-rush-config';

import {
  ReadFileInterceptor,
  ReadFileOptionsObject,
  ReadFileResult,

} from './utils/read-file-interceptor';

import { loadRushConfigSync } from './utils/load-rush-config';


const rushConfigName = 'rush.json';
const rushConfigPathRegex = new RegExp(`${rushConfigName}$`);


// noinspection JSUnusedGlobalSymbols
export async function start() {

  const readFileInterceptor = new ReadFileInterceptor();

  // Loading Super Rush config
  const { projects } = await loadSuperRushConfigOrThrow();

  // Intercepting Rush config read by Rush
  readFileInterceptor.registerInterceptor({
    pathRegExp: rushConfigPathRegex,
    once: true,
    handler: (rushConfigPath, options) => interceptRushConfigRead(
      rushConfigPath,
      options,
      projects
    ),
  });

  // Enabling interceptor
  readFileInterceptor.install();

  // Running Rush
  require('@microsoft/rush/lib/start');

}


function interceptRushConfigRead(
  rushConfigPath: string,
  options: ReadFileOptionsObject,
  projects: any

): ReadFileResult {

  // Reading original Rush config from filesystem
  const rushConfig = loadRushConfigSync(rushConfigPath);

  const projectPath = dirname(rushConfigPath);

  // Finding suitable project in Super Rush config
  const project: any = Object.values<any>(projects)
    .find(({ path }) => (path === projectPath))
  ;

  if (!project) {
    console.warn(chalk.yellow
      `Project at: "${projectPath}" is not configured in "${superRushConfigName}"`
    );
    return;
  }

  linkPackagesToRushConfig({
    rushConfig,
    project,
  });

  // Enabling deep directory nesting
  rushConfig.projectFolderMaxDepth = 1000;

  // Disabling versions consistency checks
  rushConfig.ensureConsistentVersions = false;

  const source = JSON.stringify(rushConfig, null, 4);

  return prepareReadFileResult(source, options);

}

function linkPackagesToRushConfig(options: {
  rushConfig: any;
  project: any;

}) {

  const { rushConfig: parentRushConfig, project: parentProject } = options;
  const { link: linkedProjects } = parentProject;

  if (!linkedProjects) {
    return;
  }

  // Iterating over all child monorepos
  for (const project of linkedProjects) {

    console.log(
      `Linking project: ${chalk.green(project.name)}:\n` +
      `${chalk.gray(project.path)}\n`
    );

    const rushConfigPath = `${project.path}/${rushConfigName}`;
    const rushConfig = loadRushConfigSync(rushConfigPath);

    if (!rushConfig.projects) {
      console.warn(chalk.yellow
        `Rush config at: "${chalk.gray(rushConfigPath)}" ` +
        `doesn't have "projects" property`
      );
      return;
    }

    // Iterating over all projects in child monorepo and adding them
    // to the parent Rush config
    for (const packageConfig of rushConfig.projects) {

      const {
        packageName,
        projectFolder,
        cyclicDependencyProjects,

      } = packageConfig;

      const packagePath = resolvePath(project.path, projectFolder);
      const relativePackagePath = relativePath(parentProject.path, packagePath);

      console.log(
        `Linking package: ` +
        `${chalk.green(packageName)}:\n` +
        `${chalk.gray(packagePath)}\n`
      );

      // Adding project to the root Rush config
      parentRushConfig.projects.push({
        packageName,
        projectFolder: relativePackagePath,
        shouldPublish: false,
        cyclicDependencyProjects,
      });

    }

  }

}

function prepareReadFileResult(
  content: string,
  options?: ReadFileOptionsObject

): ReadFileResult {

  // Converting result to buffer first
  const buffer = Buffer.from(content, 'utf8');

  if (options && options.encoding && options.encoding !== 'buffer') {

    // Converting content to string in the specified encoding
    return buffer.toString(options.encoding);

  } else {

    // Returning content as buffer
    return buffer;

  }

}
