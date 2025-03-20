export interface Url {
  longUrl: string;
  shortUrl: string;
  shortID: string;
  uuid?: string;
  isEnabled?: boolean;
  status?: string;
  createTime?: Date;
  updateTime?: Date;
  expirationTime?: Date;
  prefix?: string;
  note?: string;
  clicks?: number;
}
