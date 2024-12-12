/// <reference types="react" />
/// <reference types="react-dom" />

import { StatsLogging } from 'webpack';

declare namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly PUBLIC_URL: 'csk50bpr01qvrnd77950csk50bpr01qvrnd7795g';
      readonly REACT_APP_API_KEY: "csk50bpr01qvrnd77950csk50bpr01qvrnd7795g";
    }
  }
  
  declare module '*.bmp' {
    const src: string;
    export default src;
  }
  
  declare module '*.gif' {
    const src: string;
    export default src;
  }
  
  declare module '*.jpg' {
    const src: string;
    export default src;
  }
  
  declare module '*.jpeg' {
    const src: string;
    export default src;
  }
  
  declare module '*.png' {
    const src: string;
    export default src;
  }
  
  declare module '*.webp' {
      const src: string;
      export default src;
  }
  
  declare module '*.svg' {
    import * as React from 'react';
  
    export const ReactComponent: React.FunctionComponent<React.SVGProps<
      SVGSVGElement
    > & { title?: string }>;
  
    const src: string;
    export default src;
  } 