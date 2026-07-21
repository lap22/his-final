import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "@/components/auth/AuthInput";
import { loginWithEmail, registerWithEmail } from "@/services/auth.service";
import { getAuthErrorMessage } from "@/utils/firebase-error";
import {
  LoginFormErrors,
  RegisterFormErrors,
  validateLoginForm,
  validateRegisterForm,
} from "@/utils/validation";
import { auth } from "@/config/firebase";

type AuthMode = "login" | "register";

interface NoticeModalState {
  title: string;
  message: string;
  actionLabel: string;
  onConfirm: () => void;
}

export default function AuthModalScreen() {
  const params = useLocalSearchParams<{
    mode?: string;
  }>();

  const initialMode: AuthMode =
    params.mode === "register" ? "register" : "login";

  const [mode, setMode] = useState<AuthMode>(initialMode);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeModal, setNoticeModal] = useState<NoticeModalState | null>(null);

  const emailInputRef = useRef<TextInput>(null);
  const phoneNumberInputRef = useRef<TextInput>(null);
  const isLogin = mode === "login";

  const title = useMemo(
    () => (isLogin ? "Chào mừng trở lại" : "Tạo tài khoản"),
    [isLogin],
  );

  const description = useMemo(
    () =>
      isLogin
        ? "Đăng nhập để quản lý lịch khám và hồ sơ sức khỏe."
        : "Đăng ký tài khoản để bắt đầu sử dụng hệ thống.",
    [isLogin],
  );

  useEffect(() => {
    setErrors({});
    setGeneralError("");
  }, [mode]);

  function clearFieldError(field: keyof RegisterFormErrors) {
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setGeneralError("");
  }

  function resetForm() {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setGeneralError("");
  }

  function switchMode(nextMode: AuthMode) {
    if (isSubmitting) {
      return;
    }

    resetForm();
    setMode(nextMode);
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }

  function closeNoticeModal() {
    const nextAction = noticeModal?.onConfirm;

    setNoticeModal(null);
    nextAction?.();
  }

  async function handleLogin() {
    const loginErrors: LoginFormErrors = validateLoginForm(email, password);

    if (Object.keys(loginErrors).length > 0) {
      setErrors(loginErrors);
      return false;
    }

    await loginWithEmail({
      email,
      password,
    });

    return true;
  }

  async function handleRegister() {
    const registerErrors = validateRegisterForm(
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    );

    if (Object.keys(registerErrors).length > 0) {
      setErrors(registerErrors);
      return false;
    }

    await registerWithEmail({
      displayName: fullName,
      email,
      password,
      confirmPassword,
      phoneNumber,
    });

    return true;
  }

  async function handleSubmit() {
    Keyboard.dismiss();
    setGeneralError("");
    setErrors({});
    setIsSubmitting(true);

    try {
      const isSubmitSuccessful = isLogin
        ? await handleLogin()
        : await handleRegister();

      if (!isSubmitSuccessful) {
        return;
      }

      setNoticeModal({
        title: "Thành công",
        message: isLogin
          ? "Đăng nhập thành công."
          : "Đăng ký tài khoản thành công.",
        actionLabel: "Tiếp tục",
        onConfirm: () => {
          router.replace("/profiles");
        },
        
      });
    } catch (error) {
      console.error("Authentication error:", error);
      setGeneralError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />

            <Pressable
              style={styles.closeButton}
              onPress={closeModal}
              disabled={isSubmitting}
              hitSlop={10}
            >
              <Ionicons name="close" size={26} color="#334155" />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="medical" size={32} color="#FFFFFF" />
              </View>

              <Text style={styles.appName}>HIS Healthcare</Text>
            </View>

            <View style={styles.heading}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.segment}>
              <Pressable
                style={[
                  styles.segmentButton,
                  isLogin && styles.segmentButtonActive,
                ]}
                onPress={() => switchMode("login")}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isLogin && styles.segmentTextActive,
                  ]}
                >
                  Đăng nhập
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.segmentButton,
                  !isLogin && styles.segmentButtonActive,
                ]}
                onPress={() => switchMode("register")}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.segmentText,
                    !isLogin && styles.segmentTextActive,
                  ]}
                >
                  Đăng ký
                </Text>
              </Pressable>
            </View>

            {generalError ? (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#DC2626"
                />

                <Text style={styles.errorBoxText}>{generalError}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              {!isLogin ? (
                <AuthInput
                  label="Họ và tên"
                  icon="person-outline"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChangeText={(value) => {
                    setFullName(value);
                    clearFieldError("fullName");
                  }}
                  error={errors.fullName}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                />
              ) : null}

              <AuthInput
                ref={emailInputRef}
                label="Email"
                icon="mail-outline"
                placeholder="example@email.com"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  clearFieldError("email");
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                editable={!isSubmitting}
              />
              {!isLogin ? (
                <AuthInput
                  ref={phoneNumberInputRef}
                  label="Số điện thoại"
                  icon="call-outline"
                  placeholder="0123456789"
                  value={phoneNumber}
                  onChangeText={(value) => {
                    setPhoneNumber(value);
                    clearFieldError("phoneNumber");
                  }}
                  error={errors.phoneNumber}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  editable={!isSubmitting}
                />
              ) : null}

              <AuthInput
                label="Mật khẩu"
                icon="lock-closed-outline"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  clearFieldError("password");
                }}
                error={errors.password}
                isPassword
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={isLogin ? "current-password" : "new-password"}
                textContentType={isLogin ? "password" : "newPassword"}
                returnKeyType={isLogin ? "done" : "next"}
                editable={!isSubmitting}
                onSubmitEditing={isLogin ? handleSubmit : undefined}
              />

              {!isLogin ? (
                <AuthInput
                  label="Xác nhận mật khẩu"
                  icon="lock-closed-outline"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    clearFieldError("confirmPassword");
                  }}
                  error={errors.confirmPassword}
                  isPassword
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  editable={!isSubmitting}
                  onSubmitEditing={handleSubmit}
                />
              ) : null}

              {isLogin ? (
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/reset-password-modal",
                      params: {
                        email: email.trim(),
                      },
                    });
                  }}
                >
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </Pressable>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.submitButtonPressed,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>
                      {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
                    </Text>

                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isLogin ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}
              </Text>

              <Pressable
                onPress={() => switchMode(isLogin ? "register" : "login")}
                disabled={isSubmitting}
              >
                <Text style={styles.footerLink}>
                  {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <Modal
        visible={Boolean(noticeModal)}
        transparent
        animationType="fade"
        onRequestClose={closeNoticeModal}
      >
        <View style={styles.noticeBackdrop}>
          <View style={styles.noticeCard}>
            <View style={styles.noticeIcon}>
              <Ionicons name="checkmark" size={30} color="#FFFFFF" />
            </View>

            <Text style={styles.noticeTitle}>{noticeModal?.title}</Text>
            <Text style={styles.noticeMessage}>{noticeModal?.message}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.noticeButton,
                pressed && styles.noticeButtonPressed,
              ]}
              onPress={closeNoticeModal}
            >
              <Text style={styles.noticeButtonText}>
                {noticeModal?.actionLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
  },

  modalHeader: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  dragIndicator: {
    position: "absolute",
    top: 8,
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: "center",
    gap: 10,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#0284C7",
    justifyContent: "center",
    alignItems: "center",
  },

  appName: {
    color: "#0284C7",
    fontSize: 18,
    fontWeight: "700",
  },

  heading: {
    marginTop: 28,
    alignItems: "center",
    gap: 8,
  },

  title: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    maxWidth: 340,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  segment: {
    marginTop: 28,
    padding: 4,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    flexDirection: "row",
  },

  segmentButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  segmentButtonActive: {
    backgroundColor: "#FFFFFF",
  },

  segmentText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  segmentTextActive: {
    color: "#0284C7",
    fontWeight: "700",
  },

  errorBox: {
    marginTop: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  errorBoxText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 14,
    lineHeight: 20,
  },

  form: {
    marginTop: 24,
    gap: 18,
  },

  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: -4,
  },

  forgotPasswordText: {
    color: "#0284C7",
    fontSize: 14,
    fontWeight: "600",
  },

  submitButton: {
    minHeight: 54,
    marginTop: 4,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#0284C7",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  submitButtonPressed: {
    opacity: 0.85,
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
  },

  footerText: {
    color: "#64748B",
    fontSize: 14,
  },

  footerLink: {
    color: "#0284C7",
    fontSize: 14,
    fontWeight: "700",
  },

  noticeBackdrop: {
    flex: 1,
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
  },

  noticeCard: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  noticeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0284C7",
    justifyContent: "center",
    alignItems: "center",
  },

  noticeTitle: {
    marginTop: 18,
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  noticeMessage: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  noticeButton: {
    minHeight: 50,
    alignSelf: "stretch",
    marginTop: 22,
    borderRadius: 14,
    backgroundColor: "#0284C7",
    justifyContent: "center",
    alignItems: "center",
  },

  noticeButtonPressed: {
    opacity: 0.85,
  },

  noticeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
