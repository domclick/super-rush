
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
