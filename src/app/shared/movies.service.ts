import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Genre, GenresGetResponse, Movie, MovieCardsGetResponse, SearchMode} from './interfaces';
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

  fetchMovieCardsResponse(
    searchMode: SearchMode, searchString: string, movieId: number, pageNumber: number
  ): Observable<MovieCardsGetResponse> {
    let requestUrl: string;
    let params = new HttpParams();
    params = params.append('api_key', 'c4969d1f52e5bc9d149955f64ac31dd4');
    params = params.append('language', 'ru-RU');
    params = params.append('page', pageNumber.toString());

    switch (searchMode) {
      case SearchMode.Popular: {
        requestUrl = `${environment.movieDbUrl}/movie/popular`;
        break;
      }
      case SearchMode.ByString: {
        requestUrl = `${environment.movieDbUrl}/search/movie`;
        params = params.append('query', searchString);
        break;
      }
      case SearchMode.Recommended: {
        requestUrl = `${environment.movieDbUrl}/movie/`.concat(String(movieId)).concat('/recommendations');
        break;
      }
      default: {
        console.log('Error: Invalid Search Mode ', searchMode);
        break;
      }
    }

    return this.http.get(requestUrl, {params})
      .pipe(map((response: MovieCardsGetResponse) => response),
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }
}
