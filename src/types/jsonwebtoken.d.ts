declare module 'jsonwebtoken' {
  export interface JwtPayload {
    [key: string]: any;
  }

  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: string | Buffer,
    options?: {
      algorithm?: string;
      expiresIn?: string | number;
      notBefore?: string | number;
      audience?: string | string[];
      issuer?: string;
      jwtid?: string;
      subject?: string;
      noTimestamp?: boolean;
      header?: object;
      keyid?: string;
    }
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: {
      algorithms?: string[];
      audience?: string | RegExp | Array<string | RegExp>;
      clockTimestamp?: number;
      clockTolerance?: number;
      complete?: boolean;
      issuer?: string | string[];
      ignoreExpiration?: boolean;
      ignoreNotBefore?: boolean;
      jwtid?: string;
      subject?: string;
      maxAge?: string | number;
    }
  ): JwtPayload;

  export function decode(
    token: string,
    options?: {
      complete?: boolean;
      json?: boolean;
    }
  ): null | JwtPayload;
} 