import {Component, OnInit} from '@angular/core';
import {SearchMode} from '../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss']
})
export class MoviePageComponent implements OnInit {

  movieId: number;
  searchMode: SearchMode;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.searchMode = SearchMode.Recommended;
    this.route.params.subscribe((params: Params) => {
        this.movieId = +params.id;
    });
  }
}
