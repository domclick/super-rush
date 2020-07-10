/**
 * Copyright Ⓒ 2020 Sberbank Real Estate Centre Limited Liability Company. Licensed under the MIT license.
 * Please, see the LICENSE.md file in project's root for full licensing information.
 */

import loadJsonFile from 'load-json-file';
import { homedir } from 'os';


export interface SuperRushConfig {
  projects: SuperRushConfigProject[];
}

export interface SuperRushConfigProject {
  name: string;
  path: string;
  link?: string[];
}

export interface ParsedSuperRushConfig {
  projects: Record<string, ParsedSuperRushConfigProject>;
}

export interface ParsedSuperRushConfigProject {
  name: string;
  path: string;
  link?: LinkedProject[];
}

export interface LinkedProject {
  name: string;
  path: string;
}


export const superRushConfigName = 'super-rush.json';
const superRushConfigFilePath = `${homedir()}/${superRushConfigName}`;


export async function loadSuperRushConfigOrThrow(): Promise<ParsedSuperRushConfig> {

  const superRushConfig: SuperRushConfig = (
    await loadJsonFile<SuperRushConfig>(superRushConfigFilePath)
  );

  const projects: Record<string, ParsedSuperRushConfigProject> = {};

  for (const { name, path, link = [] } of superRushConfig.projects) {
    projects[name] = { name, path, link: parseLinkedProjects(link) };
  }

  return { projects };


  function parseLinkedProjects(projectNames: string[]): LinkedProject[] {
    return projectNames
      .map(projectName => findProjectByNameOrThrow(projectName))
      .map(({ name, path }) => ({ name, path }))
    ;
  }

  function findProjectByNameOrThrow(name: string): SuperRushConfigProject {
    const project = superRushConfig.projects
      .find($project => $project.name === name)
    ;
    if (!project) {
      throw new Error(
        `Project with name: "${name}" is not found in ` +
        `"${superRushConfigName}" config`
      );
    }
    return project;
  }

}
