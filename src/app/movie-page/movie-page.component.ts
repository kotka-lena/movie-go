import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Movie, MovieCard} from '../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {MoviesService} from '../shared/movies.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss']
})
export class MoviePageComponent implements OnInit {
  movie$: Observable<Movie>;
  recommendedMovieCards$: Observable<MovieCard[]>;
  resultPage: number;
  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.resultPage = 1;
    this.movie$ = this.route.params.pipe(
      switchMap((params: Params) => {
      this.recommendedMovieCards$ = this.moviesService.fetchRecommendedById(+params.id, this.resultPage);
      return this.moviesService.fetchMovieById(+params.id);
      })
    );
  }

  nextResultPage(movieId: number) {
    this.resultPage++;
    this.recommendedMovieCards$ = this.moviesService.fetchRecommendedById(movieId, this.resultPage);
  }

  previousResultPage(movieId: number) {
    if (this.resultPage > 1) {
      this.resultPage--;
      this.recommendedMovieCards$ = this.moviesService.fetchRecommendedById(movieId, this.resultPage);
    }
  }
}
