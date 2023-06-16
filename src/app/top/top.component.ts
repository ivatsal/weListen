import { Component, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../spotify.service';


@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit{
  track: any;

  @ViewChild('audioPlayer') audioPlayer: any;
  volume: number = 80;
  repeat: boolean = false;
  Object: any;

  isPlaying: boolean = false;
  isMute: boolean = true;
  audioUrl: any = '';
  currentAudioIndex: number = 0;

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

  
  playPause() {
    this.isPlaying = !this.isPlaying;
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    if (audio.paused) {
      this.audioUrl = this.track?.tracks?.items[0].track.preview_url;
      audio.play();
    } else {
      this.audioUrl = this.track?.tracks?.items[0].track.preview_url;
      audio.pause();
    }
  }

  goBackward() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.currentTime -= 5; // Go backward by 5 seconds (adjust as needed)
  }

  goForward() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.currentTime += 5; // Go forward by 5 seconds (adjust as needed)
    this.audioUrl = this.track?.tracks?.items[0].track.preview_url;
    // console.log("currentIndex", this.currentAudioIndex+1)
    // this.currentAudioIndex = this.currentAudioIndex;
    // console.log(this.audioUrl[this.currentAudioIndex+1].track.preview_url);
    
  }

   toggleMute() {
    this.isMute = !this.isMute;
    if (this.isMute) {
      // Mute functionality
      const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
      audio.volume = 0;
    } else {
      // Unmute functionality
      const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
      audio.volume = this.volume / 100;
    }
  }

  changeVolume() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.volume = this.volume / 100;
  }
}
