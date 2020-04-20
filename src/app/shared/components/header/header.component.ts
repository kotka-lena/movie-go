import {Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchString = '';
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToSearchPage() {
    if (this.searchString.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchString.trim() } });
      this.searchString = '';
    }
  }
}
