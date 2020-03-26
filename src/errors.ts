export namespace GoogleChatWebhook {
  export class InvalidArgumentError {
    public message: string;
    constructor(
      public field: string = `unknown`,
      public value?: string,
      private _message?: string,
      public fromApi: boolean = false,
    ) {
      this.message =
        _message || fromApi
          ? `Google Chat Webhook API: InvalidArgumentError. Field: '${field}'`
          : `Invalid argument provided to function call: '${field}'`;
    }
  }
  export class UnknownError {
    constructor(public message: string = "An unknown error occured.") {}
  }
}
