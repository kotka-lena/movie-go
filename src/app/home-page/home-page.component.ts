import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {MovieCard} from '../shared/interfaces';
import {MoviesService} from '../shared/movies.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  currentPageNumber: number;
  movieCardList$ByPageNumber: Observable<MovieCard[]>[] = [];
  loadingPageNumbers: number[] = [];
  showButtonUp = false;

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.currentPageNumber = 1;
    this.loadingPageNumbers.push(this.currentPageNumber);
    this.movieCardList$ByPageNumber.push(this.moviesService.fetchMovieCards('', this.currentPageNumber));
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
