import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {SearchMode} from '../shared/interfaces';
import {SearchParams} from '../shared/classes';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  searchParams: SearchParams;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.searchParams = new SearchParams(SearchMode.ByString, queryParams.q, 0, 1);
    });
  }
}
