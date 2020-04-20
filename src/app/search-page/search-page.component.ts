import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';

import {MovieCard} from '../shared/interfaces';
import {MoviesService} from '../shared/movies.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit{

  resultPage: number;
  searchString = '';
  movieCards$: Observable<MovieCard[]>;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.resultPage = 1;
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (this.searchString !== queryParams.q)
      {
        this.searchString = queryParams.q;
        this.movieCards$ = this.moviesService.fetchMovieCards(this.searchString, this.resultPage);
      }
    });
  }

  nextResultPage() {
    this.resultPage++;
    this.movieCards$ = this.moviesService.fetchMovieCards(this.searchString, this.resultPage);
  }

  previousResultPage() {
    if (this.resultPage > 1) {
      this.resultPage--;
      this.movieCards$ = this.moviesService.fetchMovieCards(this.searchString, this.resultPage);
    }
  }
}
