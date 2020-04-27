import { Component, OnInit} from '@angular/core';
import {SearchMode} from '../shared/interfaces';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  searchMode: SearchMode;

  constructor() { }

  ngOnInit(): void {
    this.searchMode = SearchMode.Popular;
  }
}
