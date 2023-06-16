import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weListen';

  menuData: any[] = [
    {
      name: 'Top 50',
      icon: 'emoji_events',
      route: ''
    },
    {
      name: 'Stream',
      icon: 'cloud',
      route: ''
    },
    {
      name: 'Likes',
      icon: 'favorite',
      route: ''
    },
    {
      name: 'Tracks',
      icon: 'sell',
      route: ''
    },
    {
      name: 'Playlists',
      icon: 'bookmark',
      route: ''
    },
  ];
}
