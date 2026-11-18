import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const USERS_KEY = "hireflow.users";
const SESSION_KEY = "hireflow.session";

export const ROLES = {
  employee: "employee",
  employer: "employer",
};

// Built-in demo accounts. Their ids match the employerId values in data/jobs.js.
// There is still no backend: registered accounts live in AsyncStorage on the
// device, and passwords are stored in plain text. Replace this file's storage
// calls with real API calls before shipping anything.
const DEMO_ACCOUNTS = [
  {
    id: "remiel",
    username: "remiel",
    email: "remiel@hireflow.demo",
    password: "1234",
    role: ROLES.employee,
  },
  {
    id: "bill",
    username: "Bill",
    email: "bill@hireflow.demo",
    password: "1234",
    role: ROLES.employer,
  },
];

const AuthContext = createContext(undefined);

// Never keep the password on the user object that the rest of the app sees.
function toPublicUser({ password, ...user }) {
  return user;
}

async function readRegisteredAccounts() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getAllAccounts() {
  return [...DEMO_ACCOUNTS, ...(await readRegisteredAccounts())];
}

export function validateRegistration({
  username,
  email,
  password,
  confirmPassword,
  role,
}) {
  const errors = {};
  const cleanUsername = (username || "").trim();
  const cleanEmail = (email || "").trim();

  if (cleanUsername.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (!/^[A-Za-z0-9_.]+$/.test(cleanUsername)) {
    errors.username = "Use only letters, numbers, dots, and underscores.";
  }

  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!Object.values(ROLES).includes(role)) {
    errors.role = "Choose how you will use HireFlow.";
  }

  return errors;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True until the saved session (if any) has been read from storage.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const savedId = await AsyncStorage.getItem(SESSION_KEY);

        if (savedId) {
          const accounts = await getAllAccounts();
          const account = accounts.find((item) => item.id === savedId);
          if (account && !cancelled) setUser(toPublicUser(account));
        }
      } catch {
        // A broken session should just mean "logged out".
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const startSession = useCallback(async (account) => {
    const publicUser = toPublicUser(account);
    setUser(publicUser);

    try {
      await AsyncStorage.setItem(SESSION_KEY, account.id);
    } catch {
      // The user is still logged in for this launch; they just won't be
      // remembered next time.
    }

    return publicUser;
  }, []);

  // identifier can be a username or an email address.
  const login = useCallback(
    async (identifier, password) => {
      const key = (identifier || "").trim().toLowerCase();
      const accounts = await getAllAccounts();
      const account = accounts.find(
        (item) =>
          item.username.toLowerCase() === key ||
          item.email.toLowerCase() === key,
      );

      if (!account || account.password !== password) {
        return { ok: false, error: "Incorrect username/email or password." };
      }

      return { ok: true, user: await startSession(account) };
    },
    [startSession],
  );

  const register = useCallback(
    async (details) => {
      const errors = validateRegistration(details);

      if (Object.keys(errors).length > 0) {
        return { ok: false, errors };
      }

      const username = details.username.trim();
      const email = details.email.trim();
      const accounts = await getAllAccounts();

      if (
        accounts.some(
          (item) => item.username.toLowerCase() === username.toLowerCase(),
        )
      ) {
        return { ok: false, errors: { username: "That username is taken." } };
      }

      if (
        accounts.some(
          (item) => item.email.toLowerCase() === email.toLowerCase(),
        )
      ) {
        return {
          ok: false,
          errors: { email: "An account with that email already exists." },
        };
      }

      const account = {
        id: `user-${Date.now()}`,
        username,
        email,
        password: details.password,
        role: details.role,
      };

      try {
        const registered = await readRegisteredAccounts();
        await AsyncStorage.setItem(
          USERS_KEY,
          JSON.stringify([...registered, account]),
        );
      } catch {
        return {
          ok: false,
          errors: { form: "Could not save your account. Please try again." },
        };
      }

      return { ok: true, user: await startSession(account) };
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    setUser(null);

    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch {
      // Already logged out in memory; nothing else to do.
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}