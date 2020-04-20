import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Genre, GenresGetResponse, MovieCard, MovieCardsGetResponse, Movie} from './interfaces';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class MoviesService {

  movieActivated$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {
  }

  fetchGenres(): Observable<Genre[]> {
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4');
    params = params.append('language', 'ru-RU');
    return this.http.get(`${environment.movieDbUrl}/genre/movie/list`,
      {
        params
      })
      .pipe(map((response: GenresGetResponse) => {
        return response.genres;
        }),
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  fetchMovieCards(searchString: string, resultPage: number): Observable<MovieCard[]> {
    let requestUrl: string;
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4');
    params = params.append('language', 'ru-RU');
    params = params.append('page', resultPage.toString());

    if (searchString === '')
    {
      requestUrl = `${environment.movieDbUrl}/movie/popular`;
    }
    else
    {
      params = params.append('query', searchString);
      requestUrl = `${environment.movieDbUrl}/search/movie`;
    }
    return this.http.get(requestUrl, { params })
      .pipe(map((response: MovieCardsGetResponse) => response.results),
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  fetchMovieById(id: number): Observable<Movie> {
    const requestUrl = `${environment.movieDbUrl}/movie/`.concat(String(id));
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4');
    params = params.append('language', 'ru-RU');
    return this.http.get(requestUrl, { params })
      .pipe(map((response: Movie) => {
          return response;
        }),
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  fetchRecommendedById(id: number, resultPage: number): Observable<MovieCard[]> {
    const requestUrl = `${environment.movieDbUrl}/movie/`.concat(String(id)).concat('/recommendations');
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4');
    params = params.append('language', 'ru-RU');
    params = params.append('page', String(resultPage));
    return this.http.get(requestUrl, { params })
      .pipe(map((response: MovieCardsGetResponse) => response.results),
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }
}
