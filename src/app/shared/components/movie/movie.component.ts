import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Movie} from '../../interfaces';
import {Observable, Subscription} from 'rxjs';
import {MoviesService} from '../../movies.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnChanges, OnInit {

  @Input() movieId: number;

  movie$: Observable<Movie>;
  genreIds: number[] = [];
  movieSub: Subscription;

  constructor(
    private moviesService: MoviesService
  ) { }

  ngOnChanges() {
    window.scrollTo(0, 0);
    if (!this.movieSub) {
      this.movieSub = this.moviesService.movieActivated$.subscribe((movieId: number) => {
        if (this.movieId !== movieId) {
          this.movieId = movieId;
          this.updateMovie();
        }
      });
    }
  }

  ngOnInit(): void {
    this.updateMovie();
  }

  updateMovie() {
    this.movie$ = this.moviesService.fetchMovieById(this.movieId)
      .pipe(
        map((movie: Movie) => {
          for (const genre of movie.genres) {
            this.genreIds.push(genre.id);
          }
          return movie;
        }));
  }
}
