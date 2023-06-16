import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = 'b2459316cd0d4ee991d93f6e3cda5fbf';
  private clientSecret = 'c6a07bbab411438ab07b056f9459add3';
  public apiUrl = 'https://api.spotify.com/v1';

  private accessToken: any;
  private accessTokenExpiration: any;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
  }

  private getClientCredentials(): Observable<any> {
    const url = 'https://accounts.spotify.com/api/token';
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`));
    const body = new HttpParams().set('grant_type', 'client_credentials');

    return this.http.post<any>(url, body, { headers });
  }

  private ensureAccessToken(): Observable<string> {
    if (this.accessToken && this.accessTokenExpiration > new Date()) {
      return of (this.accessToken);
    } else {
      return this.getClientCredentials().pipe(
        switchMap((response) => {
          const expirationSeconds = response.expires_in;
          this.accessTokenExpiration = new Date();
          this.accessTokenExpiration.setSeconds(
            this.accessTokenExpiration.getSeconds() + expirationSeconds
          );
          this.accessToken = response.access_token;
          return of(this.accessToken);
        }),
        catchError((error) => throwError('Failed to obtain access token.'))
      );
    }
  }
  getAlbum(albumId: string, market: string, limit: number = 50): Observable<any> {
    const url = `${this.apiUrl}/albums/${albumId}?market=${market}`;
    return this.ensureAccessToken().pipe(
      switchMap(() => {
        const headers = this.getHeaders();
        return this.http.get<any>(url, { headers });
      })
    );
  }
  
  getTrack(trackId: string): Observable<any> {
    const url = `${this.apiUrl}/playlists/${trackId}`;
    return this.ensureAccessToken().pipe(
      switchMap(() => {
        const headers = this.getHeaders();
        return this.http.get<any>(url, { headers });
      })
    );
  }
}
