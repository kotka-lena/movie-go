import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {MovieCard, MovieCardsGetResponse, SearchMode} from '../../interfaces';
import {MoviesService} from '../../movies.service';
import {concatMap, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-movie-card-list',
  templateUrl: './movie-card-list.component.html',
  styleUrls: ['./movie-card-list.component.scss']
})
export class MovieCardListComponent implements OnChanges, OnInit, OnDestroy {

  @Input() searchMode: SearchMode;
  @Input() searchString = '';
  @Input() movieId = 0;

  currentPageNumber: number;
  showButtonUp = false;

  pagination$: Subject<number> = new Subject<number>();
  response$: Observable<MovieCardsGetResponse>;
  movieCards: MovieCard[] = [];
  listTitle = '';
  movieSub: Subscription;

  constructor(private moviesService: MoviesService) { }

  ngOnChanges() {
    if (!this.movieSub && this.searchMode === SearchMode.Recommended) {
      this.movieSub = this.moviesService.movieActivated$.subscribe((movieId: number) => {
        if (this.movieId !== movieId) {
          this.movieId = movieId;
          this.movieCards = [];
          this.currentPageNumber = 0;
          this.addResults();
        }
      });
    }
  }

  ngOnInit(): void {
    switch (this.searchMode) {
      case SearchMode.Popular: {
        this.listTitle = 'Популярные фильмы:';
        break;
      }
      case SearchMode.ByString: {
        this.listTitle = 'Вы искали "' + this.searchString + '":';
        break;
      }
      case SearchMode.Recommended: {
        this.listTitle = 'C этим фильмом часто смотрят:';
        break;
      }
      default: {
        console.log('Error: Invalid Search Mode ', this.searchMode);
        break;
      }
    }
    this.currentPageNumber = 1;
    this.response$ = this.pagination$.pipe(
      startWith(1),
      concatMap(() => this.moviesService.fetchMovieCardsResponse(
        this.searchMode, this.searchString, this.movieId, this.currentPageNumber
      )))
      .pipe(
        map((response: MovieCardsGetResponse) => {
          response.results = this.movieCards.concat(response.results);
          this.movieCards = response.results;
          if (window.innerHeight > 400) {
            this.showButtonUp = true;
          }
          return response;
        }));
  }

  addResults() {
    this.pagination$.next(this.currentPageNumber++);
  }

  scrollUp() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.pagination$.unsubscribe();
    if (this.movieSub) {
      this.movieSub.unsubscribe();
    }
  }
}
