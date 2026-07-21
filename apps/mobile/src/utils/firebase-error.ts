import { FirebaseError } from 'firebase/app';

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không chính xác.';

    case 'auth/invalid-email':
      return 'Địa chỉ email không hợp lệ.';

    case 'auth/user-disabled':
      return 'Tài khoản đã bị vô hiệu hóa.';

    case 'auth/too-many-requests':
      return 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau.';

    case 'auth/network-request-failed':
      return 'Không thể kết nối mạng. Vui lòng kiểm tra Internet.';

    default:
      return 'Không thể đăng nhập. Vui lòng thử lại.';
  }
}