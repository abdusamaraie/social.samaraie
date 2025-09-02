declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
    serve: (handler: any) => void;
  };
}

export {};
