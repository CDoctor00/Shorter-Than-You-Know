import { User } from "../../types/token";

class LocalStorageManager {
  constructor() {}
  private themeName = "site-theme";
  private accessTokenName = "access_token";
  private refreshTokenName = "refresh_token";
  private userInfoName = "user_info";

  public getTheme(): string | null {
    return localStorage.getItem(this.themeName);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenName);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenName);
  }

  public getUserInfo(): User | undefined {
    const data = localStorage.getItem(this.userInfoName);
    if (!data) {
      return undefined;
    }

    return JSON.parse(data);
  }

  public setTheme(theme: string): void {
    localStorage.setItem(this.themeName, theme);
  }

  public setAccessToken(token: string): void {
    localStorage.setItem(this.accessTokenName, token);
  }

  public setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenName, token);
  }

  public setUserInfo(user: User): void {
    localStorage.setItem(this.userInfoName, JSON.stringify(user));
  }

  public clearData(): void {
    localStorage.removeItem(this.accessTokenName);
    localStorage.removeItem(this.refreshTokenName);
    localStorage.removeItem(this.userInfoName);
  }
}

export const localStorageManager = new LocalStorageManager();
