import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FavouritesService} from '../../favourites.service';
import {MoviesService} from '../../movies.service';

@Component({
  selector: 'app-favorites-button',
  templateUrl: './favorites-button.component.html',
  styleUrls: ['./favorites-button.component.scss']
})
export class FavoritesButtonComponent implements OnInit, OnDestroy {

  @Input() movieId: number;
  inFavourites: boolean;
  fSub: Subscription;
  mSub: Subscription;

  constructor(
    public favService: FavouritesService,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.inFavourites = this.favService.inFavourites(this.movieId);
    this.fSub = this.favService.onChange$.subscribe((movieId: number) => {
      if (movieId === this.movieId) {
        this.inFavourites = this.favService.inFavourites(this.movieId);
      }
    });
    window.addEventListener('storage', (event) => {
      if (event.key === 'fav') {
        this.inFavourites = this.favService.inFavourites(this.movieId);
      }
    });
    this.mSub = this.moviesService.movieActivated$.subscribe((movieId: number) => {
      if (movieId === this.movieId) {
        this.inFavourites = this.favService.inFavourites(movieId);
      }
    });
  }

  ngOnDestroy() {
    if (this.fSub) {
      this.fSub.unsubscribe();
    }
    if (this.mSub) {
      this.mSub.unsubscribe();
    }
  }
}
