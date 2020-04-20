import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FavouritesService {

  favoriteMovieIds: number[];
  onChange$: Subject<number> = new Subject<number>();

  inFavourites(movieId: number) {
    for (const id of this.getAll()) {
      if (movieId === id) {
        return true;
      }
    }
    return false;
  }

  add(movieId: number) {
    this.getAll().push(movieId);
    this.set();
    this.onChange$.next(movieId);
  }

  remove(movieId: number) {
    const index = this.getAll().indexOf(movieId);
    if (index !== -1) {
      this.favoriteMovieIds.splice(index, 1);
    }
    this.set();
    this.onChange$.next(movieId);
  }

  getAll(): number[] {
    const maybeIdsString = localStorage.getItem('fav');
    this.favoriteMovieIds = (maybeIdsString !== null) ? JSON.parse(maybeIdsString) : [];
    return this.favoriteMovieIds;
  }

  set() {
    localStorage.removeItem('fav');
    localStorage.setItem('fav', JSON.stringify(this.favoriteMovieIds));
  }

  clear() {
    const movieIds = this.getAll();
    localStorage.removeItem('fav');
    for (const movieId of movieIds) {
      this.onChange$.next(movieId);
    }
  }
}
