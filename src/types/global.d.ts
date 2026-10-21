declare module 'crypto-browserify';
declare module 'stream-browserify';
declare module 'buffer';

interface Module {
  hot?: {
    accept(path?: string, callback?: () => void): void;
  };
}
