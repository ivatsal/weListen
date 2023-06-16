import { Component } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { TrackService } from 'src/services/track.service';
import { AlbumService } from 'src/services/album.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weListen';

  track: any;

  constructor(private spotifyService: SpotifyService, private trackService: TrackService, private albumService: AlbumService) { }

  ngOnInit() {
    const trackId = '11dFghVXANMlKmJXsNCbNl';
    this.trackService.getTrack(trackId).subscribe(
      (response) => {
        this.track = response;
        console.log('Track:', this.track);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    const albumId = '382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc';
    const market = 'IN';
    const limit = 50;

    this.albumService.getAlbum(albumId, market, limit).subscribe(
      (albumData) => {
        console.log(albumData); // Handle the fetched album data here
      },
      (error) => {
        console.error(error); // Handle any errors that occur during fetching
      }
    );
  }
}
