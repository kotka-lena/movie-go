import {SearchMode} from './interfaces';

export class SearchParams {
  mode: SearchMode;
  query: string;
  movieId: number;
  page: number;

  constructor(mode: SearchMode, query: string, movieId: number, page: number) {
    this.mode = mode;
    this.query = query;
    this.movieId = movieId;
    this.page = page;
  }

  withPage(page: number): SearchParams {
    return new SearchParams(this.mode, this.query, this.movieId, page);
  }

  code(): string {
    return 'mode='.concat(this.mode.toString()).concat(',')
      .concat('query=').concat(JSON.stringify(this.query)).concat(',')
      .concat('movieid=').concat(this.movieId.toString()).concat(',')
      .concat('page=').concat(this.page.toString());
  }
}
