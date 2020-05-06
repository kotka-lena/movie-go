import {Component, OnInit} from '@angular/core';
import {SearchMode} from '../shared/interfaces';
import {SearchParams} from '../shared/classes';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss']
})
export class MoviePageComponent implements OnInit {

  searchParams: SearchParams;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.searchParams = new SearchParams(SearchMode.Recommended, '', +params.id, 1);
    });
  }
}
