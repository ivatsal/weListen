import { Component, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  track: any;

  @ViewChild('audioPlayer') audioPlayer: any;
  volume: number = 80;
  repeat: boolean = false;
  Object: any;

  isPlaying: boolean = false;
  isMute: boolean = true;
  audioUrl: any = '';
  currentAudioIndex: number = 0;

  currentTrackIndex: number | null = null;
  shuffledTracks: number[] = [];

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
    const tracks = this.track?.tracks?.items;

    if (audio.paused) {
      let index = 0;
      while (tracks[index]?.track.preview_url === null) {
        index++;
        if (index >= tracks.length) {
          console.log("No playable tracks found.");
          return;
        }
      }
      this.audioUrl = tracks[index].track.preview_url;
      audio.src = this.audioUrl;

      audio.addEventListener("canplaythrough", () => {
        audio.play();
      });

      audio.addEventListener("ended", () => {
        index++;
        if (index >= tracks.length) {
          console.log("All tracks played.");
          return;
        }

        while (tracks[index]?.track.preview_url === null) {
          index++;
          if (index >= tracks.length) {
            console.log("No more playable tracks found.");
            return;
          }
        }

        this.audioUrl = tracks[index].track.preview_url;
        audio.src = this.audioUrl;
        audio.play();
      });
    } else {
      audio.pause();
    }
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
    console.log("Repeat mode:", this.repeat);
  }

  shuffleTracks() {
    const tracks = this.track?.tracks?.items;
    if (!tracks) return;

    // Create an array of indices representing the track order
    this.shuffledTracks = Array.from({ length: tracks.length }, (_, i) => i);

    // Shuffle the track order using Fisher-Yates algorithm
    for (let i = this.shuffledTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledTracks[i], this.shuffledTracks[j]] = [this.shuffledTracks[j], this.shuffledTracks[i]];
    }

    this.currentTrackIndex = 0;
    this.playCurrentTrack();
    console.log(this.shuffledTracks);
  }
  playCurrentTrack() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const tracks = this.track?.tracks?.items;

    if (!tracks || !this.shuffledTracks || !this.currentTrackIndex) return;

    const shuffledIndex = this.shuffledTracks[this.currentTrackIndex];

    if (tracks[shuffledIndex]?.track.preview_url === null) {
      this.nextTrack();
      return;
    }

    this.audioUrl = tracks[shuffledIndex].track.preview_url;
    audio.src = this.audioUrl;

    audio.addEventListener("canplaythrough", () => {
      audio.play();
    });

    audio.addEventListener("ended", () => {
      this.nextTrack();
    });
  }

  nextTrack() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const tracks = this.track?.tracks?.items;

    if (!tracks || !this.shuffledTracks || !this.currentTrackIndex) return;

    this.currentTrackIndex++;
    if (this.currentTrackIndex >= tracks.length) {
      console.log("All tracks played.");
      return;
    }

    this.playCurrentTrack();
  }
  playNextTrack() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const tracks = this.track?.tracks?.items;

    let index = tracks.findIndex(
      (item: { track: { preview_url: any; }; }) => item.track.preview_url === this.audioUrl
    );
    index++;

    // Check if repeat mode is enabled and adjust the index accordingly
    if (this.repeat) {
      if (index >= tracks.length) {
        index = 0;
      }
    } else {
      if (index >= tracks.length) {
        console.log("No next track available.");
        return;
      }
    }

    while (tracks[index]?.track.preview_url === null) {
      index++;
      if (index >= tracks.length) {
        console.log("No next playable track available.");
        return;
      }
    }

    this.audioUrl = tracks[index].track.preview_url;
    audio.src = this.audioUrl;
    audio.play();
  }

  fastBackward() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.currentTime -= 5; // Go backward by 5 seconds (adjust as needed)
  }
  fastForward() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.currentTime += 5; // Go forward by 5 seconds (adjust as needed)
  }

  goBackward() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const tracks = this.track?.tracks?.items;

    let index = tracks.findIndex(
      (item: { track: { preview_url: any; }; }) => item.track.preview_url === this.audioUrl
    );
    index--;

    if (index < 0) {
      console.log("No previous track available.");
      return;
    }

    while (tracks[index]?.track.preview_url === null) {
      index--;
      if (index < 0) {
        console.log("No previous playable track available.");
        return;
      }
    }

    this.audioUrl = tracks[index].track.preview_url;
    audio.src = this.audioUrl;
    audio.play();
  }

  goForward() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const tracks = this.track?.tracks?.items;

    let index = tracks.findIndex(
      (item: { track: { preview_url: any; }; }) => item.track.preview_url === this.audioUrl
    );
    index++;

    if (index >= tracks.length) {
      console.log("No next track available.");
      return;
    }

    while (tracks[index]?.track.preview_url === null) {
      index++;
      if (index >= tracks.length) {
        console.log("No next playable track available.");
        return;
      }
    }

    this.audioUrl = tracks[index].track.preview_url;
    audio.src = this.audioUrl;
    audio.play();
  }

  toggleMute() {
    this.isMute = !this.isMute;
    if (this.isMute) {
      const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
      audio.volume = 0;
    } else {
      const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
      audio.volume = this.volume / 100;
    }
  }

  changeVolume() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.volume = this.volume / 100;
  }
}
