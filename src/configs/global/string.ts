declare global {
  interface StringConstructor {
    BLANK: string;
    SPACE: string;
    EM_SPACE: string;
  }
}

String.BLANK = '';
String.SPACE = ' ';
String.EM_SPACE = '　';

export {};
