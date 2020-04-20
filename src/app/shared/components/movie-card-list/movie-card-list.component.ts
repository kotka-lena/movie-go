import {Component, Input, OnInit} from '@angular/core';
import {MovieCard} from '../../interfaces';

@Component({
  selector: 'app-movie-card-list',
  templateUrl: './movie-card-list.component.html',
  styleUrls: ['./movie-card-list.component.scss']
})
export class MovieCardListComponent implements OnInit {

  @Input() movieCards: MovieCard[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
