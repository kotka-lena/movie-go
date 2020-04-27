import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {SearchMode} from '../shared/interfaces';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  searchString = '';
  searchMode: SearchMode;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.searchMode = SearchMode.ByString;
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (this.searchString !== queryParams.q)
      {
        this.searchString = queryParams.q;
      }
    });
  }
}
