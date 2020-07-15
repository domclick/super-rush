/**
 * Copyright Ⓒ 2020 "Sberbank Real Estate Center" Limited Liability Company.
 * Licensed under the MIT license.
 * Please, see the LICENSE.md file in project's root for full licensing information.
 */

import { readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';


export function loadRushConfigSync(configPath: string) {

  // Reading config from filesystem directly
  let source = readFileSync(configPath, {
    encoding: 'utf8',
  });

  // Removing all the comments in order to parse the JSON
  source = stripJsonComments(source, {
    whitespace: false,
  });

  // Parsing and returning the config
  return JSON.parse(source);

}
