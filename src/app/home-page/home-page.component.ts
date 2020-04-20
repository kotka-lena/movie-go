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
  resultPage: number;
  movieCards$: Observable<MovieCard[]>;
  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.resultPage = 1;
    this.movieCards$ = this.moviesService.fetchMovieCards('', this.resultPage);
  }

  nextResultPage() {
    this.resultPage++;
    this.movieCards$ = this.moviesService.fetchMovieCards('', this.resultPage);
  }

  previousResultPage() {
    if (this.resultPage > 1) {
      this.resultPage--;
      this.movieCards$ = this.moviesService.fetchMovieCards('', this.resultPage);
    }
  }
}
