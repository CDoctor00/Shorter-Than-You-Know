/*---------- REQUESTS----------*/

export interface RequestDeleteUrlBody {
  uuid: string;
  password: string;
}

export interface RequestDeleteUserBody {
  password: string;
}

export interface RequestLoginBody {
  email: string;
  password: string;
}

export interface RequestUrlBody {
  url: string;
  isEnabled: boolean;
  uuid?: string;
  prefix?: string;
  expirationTime?: string;
  password?: string;
  note?: string;
}

export interface RequestSignupBody {
  email: string;
  password: string;
  name?: string;
  surname?: string;
}

export interface RequestUpdateUserBody {
  password: string;
  newPassword?: string;
  name?: string;
  surname?: string;
}

/*---------- RESPONSES----------*/
export interface HistoryItem {
  longUrl: string;
  shortID: string;
  uuid: string;
  isEnabled: boolean;
  createTime: string;
  updateTime: string;
  prefix?: string;
  expirationTime?: string;
  password?: string;
  note?: string;
  clicks?: number;
}

export type ResponseHistory = HistoryItem[];

export interface ResponseLoginBody {
  accessToken: string;
  refreshToken: string;
}

export interface ResponseShortenBody {
  longUrl: string;
  shortID: string;
}

export interface ResponseUpdateUrlBody {
  longUrl: string;
  shortID: string;
  updateTime: string;
}
