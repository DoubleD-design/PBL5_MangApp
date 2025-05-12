import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import authService from '../../services/authService'; // update path if necessary

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    setLoading(true);
    try {
      // Đăng ký tài khoản mới
      await authService.register({ username, email, password });
      Alert.alert('Success', 'Registration successful!');
      // Ví dụ: điều hướng sang màn hình login
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', 'An error occurred while registering.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MainApp')}>
              <Text style={styles.home}>Go to Home Screen</Text>
            </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#262626',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#f97316',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  home: {
    color: '#f97316',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
});

export default RegisterScreen;
