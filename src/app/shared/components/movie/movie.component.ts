import {Component, Input, OnInit} from '@angular/core';
import {Movie} from '../../interfaces';
import {Observable, Subscription} from 'rxjs';
import {MoviesService} from '../../movies.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  @Input() movieId: number;

  movie$: Observable<Movie>;
  genreIds: number[] = [];
  movieSub: Subscription;
  error = false;

  constructor(
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.updateMovie();
    if (!this.movieSub) {
      this.movieSub = this.moviesService.movieActivated$.subscribe((movieId: number) => {
        if (this.movieId !== movieId) {
          this.movieId = movieId;
          this.updateMovie();
        }
      });
    }
  }

  updateMovie() {
    this.movie$ = this.moviesService.getMovieResult(this.movieId).pipe(
      tap({
        next: (movie: Movie) => {
          this.error = false;
          window.scrollTo(0, 0);
          for (const genre of movie.genres) {
            this.genreIds.push(genre.id);
          }
        },
        error: () => { this.error = true; }
    }));
  }
}
