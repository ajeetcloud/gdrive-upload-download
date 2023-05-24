# gdrive-upload-download
This repository has the frontend code to integrate Google Drive Api to perform file upload with progress bar & perform file download, using Google OAuth2.

### Demo
https://github.com/ajeetcloud/gdrive-upload-download/assets/44796715/ceb66e80-6480-467c-9638-91a04f181a16


I have provided the code for Multipart upload and Resumable upload in this repository.

### Multipart upload
Multipart upload is used when the size of file is less than 5 MB and we want to send metadata(e.g file name) as well.

### Resumable upload
Resumable upload is a two step process.
First we make a call to Google Drive API to fetch the location URI, where upload has to happen. Nex we use the location to send the file for upload.
