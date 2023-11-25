export class PythonScriptError extends Error {
  private code: any;
  private stderr: any;
  constructor(message: string, code: any, stderr: any) {
    super(message);
    this.code = code;
    this.stderr = stderr;
  }
}
