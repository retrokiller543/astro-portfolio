import { atom } from "nanostores";
import { type UserInfo } from "@/api/AuthClient";

export const storeAuthInfo = () => {
  window.localStorage.setItem("isAuthenticated", isAuthenticated.get().toString());

  const user = userInfo.get();

  if (user) {
    window.localStorage.setItem("userInfo", JSON.stringify(user));
  } else {
    window.localStorage.removeItem("userInfo");
  }

  const token = accessToken.get();

  if (token) {
    window.localStorage.setItem("accessToken", token);
  } else {
    window.localStorage.removeItem("accessToken");
  }
};

export const restoreAuthInfo = () => {
  const authStatus = window.localStorage.getItem("isAuthenticated");
  const user = window.localStorage.getItem("userInfo");
  const token = window.localStorage.getItem("accessToken");

  if (authStatus) {
    setIsAuthenticated(authStatus === "true");
  }

  if (user) {
    setUserInfo(JSON.parse(user));
  }

  if (token) {
    setAccessToken(token);
  }
};

export const setUserInfo = (data: UserInfo | null) => {
  userInfo.set(data);
};

export const setIsAuthenticated = (data: boolean) => {
  isAuthenticated.set(data);
};

export const setAccessToken = (data: string | null) => {
  accessToken.set(data);
};

export const userInfo = atom<UserInfo | null>(null);
export const isAuthenticated = atom(false);
export const accessToken = atom<string | null>(null);
