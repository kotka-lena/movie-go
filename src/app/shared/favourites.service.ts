import {Injectable, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {MoviesService} from './movies.service';

@Injectable({providedIn: 'root'})
export class FavouritesService implements OnDestroy {

  favouriteMovieIds: number[];
  subscribersByMovieId: Map<number, Subject<boolean>[]> = new Map();
  movieSub: Subscription;
  onChange$: Subject<number> = new Subject<number>();

  constructor(private moviesService: MoviesService) {
    this.subscribeToAllChanges();
  }

  inFavourites(movieId: number) {
    for (const id of this.getAll()) {
      if (movieId === id) {
        return true;
      }
    }
    return false;
  }

  subscribeToChanges(movieId: number): Subject<boolean> {
    const subject$: Subject<boolean> = new Subject<boolean>();
    if (this.subscribersByMovieId.has(movieId)) {
      this.subscribersByMovieId.get(movieId).push(subject$);
    }
    else {
      this.subscribersByMovieId.set(movieId, [subject$]);
    }
    return subject$;
  }

  unsubscribeFromChanges(movieId: number, subjectForMovieId$: Subject<boolean>) {
    const index = this.subscribersByMovieId.get(movieId).indexOf(subjectForMovieId$);
    if (index !== -1) {
      this.subscribersByMovieId.get(movieId).splice(index, 1);
    }
  }

  add(movieId: number) {
    this.getAll().unshift(movieId);
    this.set();
    this.onChange$.next(movieId);
    this.nextSubjectForMovieId(movieId);
  }

  remove(movieId: number) {
    const index = this.getAll().indexOf(movieId);
    if (index !== -1) {
      this.favouriteMovieIds.splice(index, 1);
    }
    this.set();
    this.onChange$.next(movieId);
    this.nextSubjectForMovieId(movieId);
  }

  getAll(): number[] {
    const maybeIdsString = localStorage.getItem('fav');
    this.favouriteMovieIds = (maybeIdsString !== null) ? JSON.parse(maybeIdsString) : [];
    return this.favouriteMovieIds;
  }

  changedMovieIds(): number[] {
    const maybeNewIdsString = localStorage.getItem('fav');
    const newFavoriteMovieIds = (maybeNewIdsString !== null) ? JSON.parse(maybeNewIdsString) : [];
    return this.favouriteMovieIds.filter(id => !newFavoriteMovieIds.includes(id))
      .concat(newFavoriteMovieIds.filter(id => !this.favouriteMovieIds.includes(id)));
  }

  subscribeToAllChanges() {
    if (!this.movieSub) {
      this.movieSub = this.moviesService.movieActivated$.subscribe((movieId: number) => {
        this.nextSubjectForMovieId(movieId);
      });
    }
    window.addEventListener('storage', (event) => {
      if (event.key === 'fav') {
        for (const movieId of this.changedMovieIds()) {
          this.nextSubjectForMovieId(movieId);
        }
      }
    });
  }

  nextSubjectForMovieId(movieId: number) {
    if (this.subscribersByMovieId.get(movieId) !== undefined) {
      for (const subject$ of this.subscribersByMovieId.get(movieId)) {
        subject$.next(true);
      }
    }
  }

  set() {
    localStorage.removeItem('fav');
    localStorage.setItem('fav', JSON.stringify(this.favouriteMovieIds));
  }

  clear() {
    const movieIds = this.getAll();
    localStorage.removeItem('fav');
    for (const movieId of movieIds) {
      this.onChange$.next(movieId);
      this.nextSubjectForMovieId(movieId);
    }
  }

  ngOnDestroy() {
    if (this.movieSub) {
      this.movieSub.unsubscribe();
    }
  }
}
