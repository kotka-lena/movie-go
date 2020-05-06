import { Component, OnInit} from '@angular/core';
import {SearchMode} from '../shared/interfaces';
import {SearchParams} from '../shared/classes';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  searchParams: SearchParams;

  constructor() { }

  ngOnInit(): void {
    this.searchParams = new SearchParams(SearchMode.Popular, '', 0, 1);
  }
}
