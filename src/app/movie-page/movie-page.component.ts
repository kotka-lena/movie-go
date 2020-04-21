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
  movieCardList$ByPageNumber: Observable<MovieCard[]>[] = [];
  currentPageNumber: number;
  loadingPageNumbers: number[] = [];
  showButtonUp = false;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.currentPageNumber = 1;
    this.loadingPageNumbers.push(this.currentPageNumber);
    this.movie$ = this.route.params.pipe(
      switchMap((params: Params) => {
        this.loadingPageNumbers = [];
        this.movieCardList$ByPageNumber = [];
        this.fetchRecommendedById(+params.id, this.currentPageNumber);
        return this.moviesService.fetchMovieById(+params.id);
      })
    );
  }

  fetchRecommendedById(movieId: number, currentPageNumber: number) {
    this.loadingPageNumbers.push(this.currentPageNumber);
    this.movieCardList$ByPageNumber.push(this.moviesService.fetchRecommendedById(movieId, currentPageNumber));
  }

  nextResultPage() {
    this.currentPageNumber++;
    this.loadingPageNumbers.push(this.currentPageNumber);
    this.movieCardList$ByPageNumber.push(this.moviesService.fetchMovieCards('', this.currentPageNumber));
    if (window.innerHeight > 400) {
      this.showButtonUp = true;
    }
  }

  scrollUp() {
    window.scrollTo(0, 0);
  }
}
