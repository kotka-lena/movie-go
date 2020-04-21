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

  currentPageNumber: number;
  searchString = '';
  movieCardList$ByPageNumber: Observable<MovieCard[]>[] = [];
  loadingPageNumbers: number[] = [];
  showButtonUp = false;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.currentPageNumber = 1;
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (this.searchString !== queryParams.q)
      {
        this.searchString = queryParams.q;
        this.movieCardList$ByPageNumber = [];
        this.currentPageNumber = 1;
        this.loadingPageNumbers = [];
        this.loadingPageNumbers.push(this.currentPageNumber);
        this.movieCardList$ByPageNumber.push(this.moviesService.fetchMovieCards(this.searchString, this.currentPageNumber));
      }
    });
  }

  nextResultPage() {
    this.currentPageNumber++;
    this.loadingPageNumbers.push(this.currentPageNumber);
    this.movieCardList$ByPageNumber.push(this.moviesService.fetchMovieCards(this.searchString, this.currentPageNumber));
    if (window.innerHeight > 400) {
      this.showButtonUp = true;
    }
  }

  scrollUp() {
    window.scrollTo(0, 0);
  }
}
