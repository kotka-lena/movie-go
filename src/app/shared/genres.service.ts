import {Injectable} from '@angular/core';
import {Genre} from './interfaces';
import {MoviesService} from './movies.service';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class GenresService {

  genres: Genre[] = [];
  genresLoaded$: Subject<boolean> = new Subject<boolean>();

  constructor(private moviesService: MoviesService) {
  }

  getGenreNameList(genreIds: number[]): string[] {
    this.loadGenres();
    const genreNames: string[] = [];
    for (const genre of this.genres) {
      if (this.inList(genre.id, genreIds)) {
        genreNames.push(genre.name);
      }
    }
    return genreNames;
  }

  loadGenres() {
    const maybeGenresString = localStorage.getItem('genres');
    if (maybeGenresString !== null) {
      this.genres = JSON.parse(maybeGenresString);
    } else {
      this.moviesService.fetchGenres().subscribe((genres: Genre[]) => {
        this.genres = genres;
        this.genresLoaded$.next(true);
        localStorage.setItem('genres', JSON.stringify(this.genres));
      });
    }
  }

  inList(genreId: number, genreIds: number[]) {
    for (const id of genreIds) {
      if (genreId === id) {
        return true;
      }
    }
    return false;
  }
}
