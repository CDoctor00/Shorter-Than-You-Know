export interface Url {
  longUrl: string;
  shortUrl: string;
  shortID: string;
  uuid?: string;
  hasPassword?: boolean;
  isEnabled?: boolean;
  status?: string;
  createTime?: Date;
  updateTime?: Date;
  expirationTime?: Date;
  prefix?: string;
  note?: string;
  clicks?: number;
}
