interface FirebaseErrorLike {
  code?: string;
  message?: string;
}

export function getFirebaseAuthError(error: unknown): string {
  const firebaseError = error as FirebaseErrorLike;

  switch (firebaseError.code) {
    case 'auth/invalid-email':
      return 'Email không đúng định dạng.';

    case 'auth/user-disabled':
      return 'Tài khoản này đã bị vô hiệu hóa.';

    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản với email này.';

    case 'auth/wrong-password':
      return 'Mật khẩu không chính xác.';

    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không chính xác.';

    case 'auth/email-already-in-use':
      return 'Email này đã được sử dụng.';

    case 'auth/weak-password':
      return 'Mật khẩu chưa đủ mạnh.';

    case 'auth/too-many-requests':
      return 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.';

    case 'auth/network-request-failed':
      return 'Không thể kết nối mạng. Vui lòng kiểm tra Internet.';

    case 'auth/operation-not-allowed':
      return 'Phương thức đăng nhập Email/Password chưa được bật.';

    default:
      return 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
}