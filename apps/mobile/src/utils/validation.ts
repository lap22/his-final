export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterFormErrors extends LoginFormErrors {
  fullName?: string;
  phoneNumber?: string;
  confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(
  email: string,
  password: string,
): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Email không đúng định dạng.';
  }

  if (!password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  } else if (password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
  }

  return errors;
}

export function validateRegisterForm(
  fullName: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {
    ...validateLoginForm(email, password),
  };

  if (!fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên.';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự.';
  }

  if (!phoneNumber.trim()) {
    errors.phoneNumber = 'Vui lòng nhập số điện thoại.';
  } else if (!/^\d{10,11}$/.test(phoneNumber.trim())) {
    errors.phoneNumber = 'Số điện thoại không đúng định dạng.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
  }

  return errors;
}