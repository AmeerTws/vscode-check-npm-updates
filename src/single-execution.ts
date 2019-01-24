import * as logger from "./logger";

/**
 * Allows execution of only one instance of a function.
 */
export class SingleExecution {
  private _func: () => Promise<any>;
  private _onAlreadyExecuting: () => void;
  private _isExecuting: boolean;

  constructor(
    functionReturningPromise: () => Promise<any>,
    onAlreadyExecuting: () => void
  ) {
    if (!functionReturningPromise) {
      throw new Error("Function returning promise should be defined.");
    }

    this._func = functionReturningPromise;
    this._onAlreadyExecuting = onAlreadyExecuting;
    this._isExecuting = false;

    logger.logInfo("SingleExecution created");
  }

  execute(): Promise<any> {
    if (this._isExecuting) {
      if (!!this._onAlreadyExecuting) {
        this._onAlreadyExecuting();
      }
      return Promise.resolve();
    }

    logger.logInfo("Executing single instance of function...");

    this._isExecuting = true;

    return this._func()
      .then(data => {
        logger.logInfo(
          "Executing of single instance of function is finished successfully."
        );
        this._isExecuting = false;
        return data;
      })
      .catch(err => {
        logger.logInfo(
          "Executing of single instance of function is finished with error."
        );
        this._isExecuting = false;
        throw err;
      });
  }
}