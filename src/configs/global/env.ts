declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var $env: Record<string, string>;
}

globalThis.$env = {
  APP_RELEASE: process.env.NEXT_PUBLIC_APP_RELEASE || new Date().toISOString(),
};

export {};
