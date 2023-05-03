import {Injectable} from "@angular/core";
import {CLIENT_ID, CLIENT_SECRET, G_DRIVE_SCOPE, GOOGLE_OAUTH_ENDPOINT, REDIRECT_URI} from "../common/constants";
import {HttpClient} from "@angular/common/http";
import {AccessTokenRequest, AccessTokenResponse} from "../common/types";

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  private oAuth2Code = '';

  private refreshToken = '';

  constructor(private http: HttpClient) {
  }

  // https://www.googleapis.com/auth/drive - See, edit, create, and delete all of your Google Drive files
  // https://www.googleapis.com/auth/drive.file - See, edit, create, and delete only the specific Google Drive files you use with this app

  authorize() {
    // @ts-ignore
    const client = google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: G_DRIVE_SCOPE,
      ux_mode: 'popup',
      callback: (response: any) => {
        this.setOAuth2Code(response.code);
        this.getAccessToken();
      },
    });
    client.requestCode();
  }

  getAccessToken() {
    const accessTokenRequest = this.getAccessTokenRequest();
    this.http.post<AccessTokenResponse>(GOOGLE_OAUTH_ENDPOINT, accessTokenRequest)
      .subscribe((res: AccessTokenResponse) => {
        console.log(res);
      });
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

  setOAuth2Code(oAuth2Code: string) {
    this.oAuth2Code = oAuth2Code;
  }

  getOAuth2Code() {
    return this.oAuth2Code;
  }

}
