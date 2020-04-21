import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Movie} from '../../interfaces';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnChanges, OnInit {

  @Input() movie: Movie;
  genreIds: number[] = [];

  constructor() { }

  ngOnChanges() {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    for (const genre of this.movie.genres) {
      this.genreIds.push(genre.id);
    }
  }
}
