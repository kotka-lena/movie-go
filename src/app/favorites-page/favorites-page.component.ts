import {Component, OnDestroy, OnInit} from '@angular/core';
import {FavouritesService} from '../shared/favourites.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss']
})
export class FavoritesPageComponent implements OnInit, OnDestroy {

  favoriteMovieIds: number[] = [];
  fSub: Subscription;

  constructor(
    public favService: FavouritesService
  ) { }

  ngOnInit(): void {
    this.favoriteMovieIds = this.favService.getAll();
    this.fSub = this.favService.onChange$.subscribe(() => {
      this.favoriteMovieIds = this.favService.getAll();
    });
  }

  inList(movieId: number) {
    for (const id of this.favoriteMovieIds) {
      if (movieId === id) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    if (this.fSub) {
      this.fSub.unsubscribe();
    }
  }
}
