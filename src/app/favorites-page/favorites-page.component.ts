import {Component, OnDestroy, OnInit} from '@angular/core';
import {MoviesService} from '../shared/movies.service';
import {FavouritesService} from '../shared/favourites.service';
import {Movie} from '../shared/interfaces';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss']
})
export class FavoritesPageComponent implements OnInit, OnDestroy {

  favoriteMovieIds: number[] = [];
  movies: Movie[] = [];
  fSub: Subscription;

  constructor(
    public favService: FavouritesService,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.favoriteMovieIds = this.favService.getAll();
    this.fSub = this.favService.onChange$.subscribe(() => {
      this.favoriteMovieIds = this.favService.getAll();
    });
    for (const movieId of this.favoriteMovieIds) {
      this.moviesService.fetchMovieById(movieId).subscribe((movie: Movie) => {
        this.movies.push(movie);
      });
    }
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
