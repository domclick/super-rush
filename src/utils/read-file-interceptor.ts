/**
 * Copyright Ⓒ 2020 Sberbank Real Estate Centre LLC. Licensed under the MIT license.
 * Please, see the LICENSE.md file in project's root for full licensing information.
 */

import fs, { PathLike } from 'fs';


type ReadFilePath = (PathLike | number);

export type ReadFileOptionsObject = {
  encoding?: (string | null);
  flag?: string;
};

type ReadFileOptions = (ReadFileOptionsObject | string | null);

export type ReadFileResult = (string | Buffer);

interface Interceptor {
  pathRegExp: RegExp;
  handler: (path: string, options?: ReadFileOptionsObject) => ReadFileResult;
  once?: boolean;
}


/**
 * Allows to intercept requests to "fs.readFileSync" and to
 * provide alternative implementation.
 */
export class ReadFileInterceptor {

  public readFileSyncOriginal = fs.readFileSync;


  private interceptors: Interceptor[] = [];


  public install() {

    // @ts-ignore: taking responsibility to correctly override this function
    fs.readFileSync = this.intercept.bind(this);

  }

  // noinspection JSUnusedGlobalSymbols
  public uninstall() {

    fs.readFileSync = this.readFileSyncOriginal;

  }

  public registerInterceptor(interceptor: Interceptor) {

    this.interceptors.push(interceptor);

  }

  public deregisterInterceptor(interceptor: Interceptor) {

    const index = this.interceptors.indexOf(interceptor);
    if (index !== -1) {
      this.interceptors.splice(index, 1);
    }

  }


  private intercept(path: ReadFilePath, options: ReadFileOptions): ReadFileResult {

    let result: ReadFileResult;

    if (typeof path === 'string') {

      const normalizedOptions = this.normalizeReadFileOptions(options);

      // Finding matching interceptor among the registered ones
      for (const interceptor of this.interceptors) {

        if (interceptor.pathRegExp.test(path)) {

          // Automatically deregistering once-only interceptors
          if (interceptor.once) {
            this.deregisterInterceptor(interceptor);
          }

          // Calling the interceptor function
          result = interceptor.handler(path, normalizedOptions);

          // First interceptor that returns non-void result wins
          if (result !== undefined) {
            break;
          }

        }

      }

    }

    if (result) {
      return result;

    } else {

      // Falling back to original function if no result where returned
      return this.readFileSyncOriginal(path, options);

    }

  }

  private normalizeReadFileOptions(options: ReadFileOptions): ReadFileOptionsObject {

    if (!options) {
      return undefined;
    }

    if (typeof options === 'string') {
      return { encoding: options };
    } else {
      return options;
    }

  }

}
