import { FirebaseError } from 'firebase/app';

export const getErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return '入力したメールアドレスはすでに登録されています。';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません';
    case 'auth/user-disabled':
      return 'サービスの利用が停止されています';
    case 'auth/user-not-found':
      return 'メールアドレスまたはパスワードが違います';
    case 'auth/weak-password':
      return 'パスワードは 6 文字以上で設定してください';
    case 'auth/wrong-password':
      return 'メールアドレスまたはパスワードが違います';
    case 'auth/operation-not-supported-in-this-environment':
    case 'auth/auth-domain-config-required':
    case 'auth/operation-not-allowed':
    case 'auth/unauthorized-domain':
      return '現在この認証方法はご利用頂けません';
    default:
      return 'エラーが発生しました。しばらく時間をおいてお試しください';
  }
};

// error instanceof FirebaseError が動かないので暫定
export const isFirebaseError = (value: unknown): value is FirebaseError => {
  if (!(value instanceof Error)) return false;
  return 'code' in value && 'message' in value;
};
