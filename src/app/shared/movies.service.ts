import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  Movie,
  MovieCardsGetResponse,
  SearchMode
} from './interfaces';
import {environment} from '../../environments/environment';
import {SearchParams} from './classes';

@Injectable({providedIn: 'root'})
export class MoviesService {

  movieActivated$: Subject<number> = new Subject<number>();
  queryActivated$: Subject<string> = new Subject<string>();
  private movieResultById: Map<number, Movie> = new Map<number, Movie>();
  private movieCardsResultBySearchParams: Map<string, MovieCardsGetResponse> = new Map<string, MovieCardsGetResponse>();

  constructor(private http: HttpClient) {
  }

  getMovieCardsResult(searchParams: SearchParams): Observable<MovieCardsGetResponse> {
    if (!this.movieCardsResultBySearchParams.has(searchParams.code())){
      return this.fetchMovieCardsResponse(searchParams).pipe(
        map((response: MovieCardsGetResponse) => {
          this.movieCardsResultBySearchParams.set(searchParams.code(), response);
          return response;
        }));
    }
    else {
      return of(this.movieCardsResultBySearchParams.get(searchParams.code()));
    }
  }

  getMovieResult(movieId: number): Observable<Movie> {
    if (!this.movieResultById.has(movieId)) {
      return this.fetchMovie(movieId).pipe(
        map((movie: Movie) => {
          this.movieResultById.set(movieId, movie);
          return movie;
        }));
    }
    else {
      return of(this.movieResultById.get(movieId) as Movie);
    }
  }

  fetchGenres(): Observable<any> {
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4')
      .append('language', 'ru-RU');

    return this.http.get(`${environment.movieDbUrl}/genre/movie/list`, {params});
  }

  fetchMovie(movieId: number): Observable<any> {
    const requestUrl = `${environment.movieDbUrl}/movie/`.concat(String(movieId));
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4')
      .append('language', 'ru-RU');

    return this.http.get(requestUrl, {params});
  }

  fetchMovieCardsResponse(searchParams: SearchParams): Observable<any> {
    let requestUrl: string;
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4')
      .append('language', 'ru-RU')
      .append('page', searchParams.page.toString());

    switch (searchParams.mode) {
      case SearchMode.Popular: {
        requestUrl = `${environment.movieDbUrl}/movie/popular`;
        break;
      }
      case SearchMode.ByString: {
        requestUrl = `${environment.movieDbUrl}/search/movie`;
        params = params.append('query', searchParams.query);
        break;
      }
      case SearchMode.Recommended: {
        requestUrl = `${environment.movieDbUrl}/movie/`.concat(searchParams.movieId.toString()).concat('/recommendations');
        break;
      }
      default: {
        console.log('Error: Invalid Search Mode');
        break;
      }
    }

    return this.http.get(requestUrl, {params});
  }
}
