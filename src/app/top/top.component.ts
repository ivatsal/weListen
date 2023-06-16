import { Component } from '@angular/core';
import { SpotifyService } from '../spotify.service';


@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent {
  track: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    const trackId = '37i9dQZEVXbMDoHDwVN2tF';
    this.spotifyService.getTrack(trackId).subscribe(
      (response) => {
        this.track = response;
        console.log('Track:', this.track);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
