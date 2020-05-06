import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription, throwError} from 'rxjs';
import {MovieCard, MovieCardsGetResponse, SearchMode} from '../../interfaces';
import {MoviesService} from '../../movies.service';
import {catchError, concatMap, map, startWith} from 'rxjs/operators';
import {SearchParams} from '../../classes';

@Component({
  selector: 'app-movie-card-list',
  templateUrl: './movie-card-list.component.html',
  styleUrls: ['./movie-card-list.component.scss']
})
export class MovieCardListComponent implements OnInit, OnDestroy {

  @Input() searchParams: SearchParams;

  pagination$: Subject<number> = new Subject<number>();
  response$: Observable<MovieCardsGetResponse>;
  movieCards: MovieCard[] = [];
  movieSub: Subscription;
  querySub: Subscription;
  listTitle = '';
  page = 1;
  error = false;
  showButtonUp = false;

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.updateListTitle();

    this.response$ = this.pagination$.pipe(
      startWith(1),
      concatMap((page: number) => {
        return this.moviesService.getMovieCardsResult(this.searchParams.withPage(page));
      })
    ).pipe(
      map((response: MovieCardsGetResponse) => {
        this.error = false;
        response.results = this.movieCards.concat(response.results);
        this.movieCards = response.results;
        if (window.innerHeight > 800) {
          this.showButtonUp = true;
        }
        return response;
      }),
      catchError(error => {
        this.error = true;
        return throwError(error);
      }));

    if (!this.movieSub && this.searchParams.mode === SearchMode.Recommended) {
      this.movieSub = this.moviesService.movieActivated$.subscribe((movieId: number) => {
        if (this.searchParams.movieId === movieId) { return; }
        this.searchParams = new SearchParams(SearchMode.Recommended, '', movieId, 1);
        this.restartSearch();
      });
    }

    if (!this.querySub && this.searchParams.mode === SearchMode.ByString) {
      this.querySub = this.moviesService.queryActivated$.subscribe((searchString: string) => {
        if (this.searchParams.query === searchString) { return; }
        this.searchParams  = new SearchParams(SearchMode.ByString, searchString, 0, 1);
        this.restartSearch();
      });
    }
  }

  updateListTitle() {
    switch (this.searchParams.mode) {
      case SearchMode.Popular: {
        this.listTitle = 'Популярные фильмы:';
        break;
      }
      case SearchMode.ByString: {
        this.listTitle = 'Вы искали "' + this.searchParams.query + '":';
        break;
      }
      case SearchMode.Recommended: {
        this.listTitle = 'C этим фильмом часто смотрят:';
        break;
      }
      default: {
        console.log('Error: Invalid Search Mode');
        break;
      }
    }
  }

  addResults() {
    this.page++;
    this.pagination$.next(this.page);
  }

  restartSearch() {
    this.updateListTitle();
    this.page = 1;
    this.movieCards = [];
    this.pagination$.next(this.page);
  }

  scrollUp() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.pagination$.unsubscribe();
    if (this.movieSub) {
      this.movieSub.unsubscribe();
    }
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
  }
}
