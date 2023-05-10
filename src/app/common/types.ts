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

export interface RefreshTokenRequest {
  client_id: string,
  client_secret: string,
  grant_type: string,
  refresh_token: string,
}

export interface RefreshTokenResponse {
  access_token: string,
  expires_in: number,
  scope: string,
  token_type: string,
  id_token: string,
}

export interface DriveUploadResponse {
  kind: string,
  id: string,
  name: string,
  mimeType: string,
}

export interface FileDetails {
  name: string,
  size: string,
  driveUrl?: string,
  progress?: number,
}

