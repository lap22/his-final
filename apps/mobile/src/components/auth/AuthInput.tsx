import { Ionicons } from '@expo/vector-icons';
import {
  forwardRef,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon:
    | 'mail-outline'
    | 'lock-closed-outline'
    | 'call-outline'
    | 'person-outline';
  isPassword?: boolean;
}

const AuthInput = forwardRef<TextInput, AuthInputProps>(
  function AuthInput(
    {
      label,
      error,
      icon,
      isPassword = false,
      ...textInputProps
    },
    ref,
  ) {
    const [isPasswordVisible, setIsPasswordVisible] =
      useState(false);

    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>

        <View
          style={[
            styles.inputContainer,
            error ? styles.inputContainerError : null,
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={error ? '#DC2626' : '#64748B'}
          />

          <TextInput
            ref={ref}
            {...textInputProps}
            style={styles.input}
            placeholderTextColor="#94A3B8"
            secureTextEntry={
              isPassword ? !isPasswordVisible : false
            }
          />

          {isPassword ? (
            <Pressable
              hitSlop={10}
              onPress={() =>
                setIsPasswordVisible(
                  (previous) => !previous,
                )
              }
            >
              <Ionicons
                name={
                  isPasswordVisible
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={20}
                color="#64748B"
              />
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
      </View>
    );
  },
);

export default AuthInput;

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },

  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },

  inputContainer: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  inputContainerError: {
    borderColor: '#DC2626',
  },

  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
  },
});