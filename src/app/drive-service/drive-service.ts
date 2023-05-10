import {Injectable} from "@angular/core";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  DRIVE_FILE_UPLOAD_MULTIPART_ENDPOINT,
  DRIVE_FILE_UPLOAD_RESUMABLE_ENDPOINT,
  G_DRIVE_SCOPE,
  GOOGLE_OAUTH_ENDPOINT,
  REDIRECT_URI,
  RESET_ACCESS_TOKEN_INTERVAL_MS
} from "../common/constants";
import {HttpClient, HttpEvent, HttpHeaders, HttpResponse} from "@angular/common/http";
import {
  AccessTokenRequest,
  AccessTokenResponse,
  DriveUploadResponse,
  RefreshTokenRequest,
  RefreshTokenResponse
} from "../common/types";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  private oAuth2Code = '';
  private accessToken = '';
  private refreshToken = '';

  private accessTokenRetrievedSubject = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  authorize() {
    // @ts-ignore
    const client = google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: G_DRIVE_SCOPE,
      ux_mode: 'popup',
      callback: (response: any) => {
        this.setOAuth2Code(response.code);
        this.retrieveAccessToken();
      },
    });
    client.requestCode();
  }

  /**
   * Uses the OAuth2 code to retrieve short-lived 'accessToken' with expiry
   * and long-lived 'refreshToken'.
   */
  retrieveAccessToken() {
    const accessTokenRequest = this.getAccessTokenRequest();
    this.http.post<AccessTokenResponse>(GOOGLE_OAUTH_ENDPOINT, accessTokenRequest)
      .subscribe((res: AccessTokenResponse) => {
        this.setAccessToken(res.access_token);
        this.setRefreshToken(res.refresh_token);
        this.checkAccessToken();
        this.setAccessTokenRetrievedSubject();
      });
  }

  /**
   * Uses 'refreshToken' to get a new 'accessToken'.
   */
  refreshAccessToken() {
    const refreshTokenRequest = this.getRefreshTokenRequest();
    this.http.post<RefreshTokenResponse>(GOOGLE_OAUTH_ENDPOINT, refreshTokenRequest)
      .subscribe((res: RefreshTokenResponse) => {
        this.setAccessToken(res.access_token);
      });
  }

  /**
   * Retrieves a new access token, on expiry.
   */
  checkAccessToken() {
    setInterval(this.refreshAccessToken, RESET_ACCESS_TOKEN_INTERVAL_MS);
  }

  getAccessTokenRequest(): AccessTokenRequest {
    return {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: this.getOAuth2Code(),
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    };
  }

  getRefreshTokenRequest(): RefreshTokenRequest {
    return {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: this.getRefreshToken(),
    };
  }

  /**
   * Performs multipart Google Drive file upload with metadata.
   * Can upload files upto 5 MB or less, as per drive API.
   *
   * @param file
   */
  uploadFileWithMetadata(file: File): Observable<HttpEvent<DriveUploadResponse>> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
    const metadata = {
      name: file.name,
    };
    const formData: FormData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    formData.append('file', file);

    return this.http.post<DriveUploadResponse>(DRIVE_FILE_UPLOAD_MULTIPART_ENDPOINT, formData, {
      headers: headers,
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Retrieves the location in which the file has to be uploaded.
   *
   * @param file
   */
  getLocationForLargeFileUpload(file: File): Observable<HttpResponse<any>> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
    const metadata = {
      name: file.name,
    };
    const formData: FormData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));

    return this.http
      .post <HttpResponse<any>>(DRIVE_FILE_UPLOAD_RESUMABLE_ENDPOINT, JSON.stringify(metadata), {
        headers: headers,
        observe: 'response'
      });
  }

  /**
   * Uploads files larger than 5 MB to Google Drive.
   *
   * @param location
   * @param file
   */
  uploadLargeFile(location: string, file: File): Observable<HttpEvent<DriveUploadResponse>> {
    return this.http.put<DriveUploadResponse>(location, file, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getOAuth2Code() {
    return this.oAuth2Code;
  }

  setOAuth2Code(oAuth2Code: string) {
    this.oAuth2Code = oAuth2Code;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  getAccessTokenRetrievedSubject(): Subject<void> {
    return this.accessTokenRetrievedSubject;
  }

  setAccessTokenRetrievedSubject() {
    this.accessTokenRetrievedSubject.next();
  }

}
