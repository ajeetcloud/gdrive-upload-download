import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  private oAuth2Code = '';

  private refreshToken = '';

  // https://www.googleapis.com/auth/drive - See, edit, create, and delete all of your Google Drive files
  // https://www.googleapis.com/auth/drive.file - See, edit, create, and delete only the specific Google Drive files you use with this app

  getAccessToken() {

    // @ts-ignore
    const client = google.accounts.oauth2.initCodeClient({
      client_id: '1016033627023-u8eibbvg9l1cmurskqrmfql5ndtquaap.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.file',
      ux_mode: 'popup',
      callback: (response: any) => {
        console.log(response);
        this.setOAuth2Code(response.code);
      },
    });
    client.requestCode();
  }

  setOAuth2Code(oAuth2Code: string) {
    this.oAuth2Code = oAuth2Code;
  }

  getOAuth2Code() {
    return this.oAuth2Code;
  }

}
