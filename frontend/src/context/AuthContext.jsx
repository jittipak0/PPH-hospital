import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const STORAGE_KEY = 'pph-hospital-auth-state';

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
  acceptPrivacy: z.boolean(),
});

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
        };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to parse auth storage', error);
    }
    return { user: null, accessToken: null, refreshToken: null };
  });
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      })
    );
  }, [state.user, state.accessToken, state.refreshToken]);

  const fetchCsrfToken = useCallback(async () => {
    const response = await axios.get(`${API_BASE}/auth/csrf-token`, { withCredentials: true });
    setCsrfToken(response.data.csrfToken);
    return response.data.csrfToken;
  }, []);

  useEffect(() => {
    fetchCsrfToken().catch(() => {});
  }, [fetchCsrfToken]);

  const refreshSession = useCallback(async () => {
    if (!state.refreshToken) {
      return null;
    }
    const { data } = await axios.post(
      `${API_BASE}/auth/refresh`,
      { refreshToken: state.refreshToken },
      { withCredentials: true }
    );
    setState((prev) => ({
      user: prev.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || prev.refreshToken,
    }));
    return data.accessToken;
  }, [state.refreshToken]);

  const login = useCallback(
    async (credentials) => {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) {
        throw new Error('กรุณากรอกข้อมูลให้ถูกต้อง (รหัสผ่านอย่างน้อย 8 ตัวอักษร)');
      }
      const token = await fetchCsrfToken();
      const { data } = await axios.post(`${API_BASE}/auth/login`, parsed.data, {
        headers: {
          'X-CSRF-Token': token,
        },
        withCredentials: true,
      });
      setState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      await fetchCsrfToken();
      return data.user;
    },
    [fetchCsrfToken]
  );

  const logout = useCallback(async () => {
    if (!state.refreshToken) {
      setState({ user: null, accessToken: null, refreshToken: null });
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const token = await fetchCsrfToken();
    try {
      await axios.post(
        `${API_BASE}/auth/logout`,
        { refreshToken: state.refreshToken },
        {
          headers: {
            'X-CSRF-Token': token,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Logout failed', error);
    }
    setState({ user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem(STORAGE_KEY);
    await fetchCsrfToken();
  }, [state.refreshToken, fetchCsrfToken]);

  const authorizedRequest = useCallback(
    async (config, { requireCsrf = false } = {}) => {
      const requestConfig = {
        ...config,
        baseURL: API_BASE,
        withCredentials: true,
        headers: {
          ...(config.headers || {}),
        },
      };
      if (state.accessToken) {
        requestConfig.headers.Authorization = `Bearer ${state.accessToken}`;
      }

      if (requireCsrf) {
        const token = await fetchCsrfToken();
        requestConfig.headers['X-CSRF-Token'] = token;
      } else if (csrfToken) {
        requestConfig.headers['X-CSRF-Token'] = csrfToken;
      }

      try {
        return await axios(requestConfig);
      } catch (error) {
        if (error.response?.status === 401 && state.refreshToken && !config._retry) {
          const newAccessToken = await refreshSession();
          if (newAccessToken) {
            const retryConfig = {
              ...config,
              _retry: true,
              baseURL: API_BASE,
              withCredentials: true,
              headers: {
                ...(config.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
              },
            };
            if (requireCsrf) {
              const token = await fetchCsrfToken();
              retryConfig.headers['X-CSRF-Token'] = token;
            }
            return axios(retryConfig);
          }
        }
        throw error;
      }
    },
    [state.accessToken, state.refreshToken, csrfToken, fetchCsrfToken, refreshSession]
  );

  const value = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: Boolean(state.user && state.accessToken),
      login,
      logout,
      authorizedRequest,
      refreshSession,
      fetchCsrfToken,
    }),
    [state.user, state.accessToken, login, logout, authorizedRequest, refreshSession, fetchCsrfToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
