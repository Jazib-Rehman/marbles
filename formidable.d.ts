// types/formidable.d.ts
declare module "formidable" {
  import { IncomingMessage } from "http";

  export class File {
    size: number;
    path: string;
    name: string;
    type: string;
    lastModifiedDate?: Date;
    hash?: string;

    toJSON(): Record<string, any>;
  }

  export interface Fields {
    [key: string]: string | string[];
  }

  export interface Files {
    [key: string]: File | File[];
  }

  export interface Options {
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
    maxFieldsSize?: number;
    maxFields?: number;
    hash?: boolean | "sha1" | "md5";
    multiples?: boolean;
  }

  export default class IncomingForm {
    constructor(options?: Options);
    parse(
      req: IncomingMessage,
      callback?: (err: any, fields: Fields, files: Files) => void
    ): void;
    on(event: string, callback: (...args: any[]) => void): this;
  }
}
