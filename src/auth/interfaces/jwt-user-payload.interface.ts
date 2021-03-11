export interface JwtUserPayload {
  id: number;
  name?: string;
  email: string;
  provider: string;
}
