export interface AccessTokenRequest {
  client_id: string,
  client_secret: string,
  code: string
  grant_type: string,
  redirect_uri: string,
}

export interface AccessTokenResponse {
  access_token: string,
  expires_in: number,
  refresh_token: string,
  scope: string,
  token_type: string,
  id_token: string,
}

