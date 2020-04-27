import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MoviesService} from '../../movies.service';
import {MovieCard, MovieCardsGetResponse, SearchMode} from '../../interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  quickSearchProcessedString = null;
  searchTimer = null;
  searchInfoByString: Map<string, MovieCard[]> = new Map<string, MovieCard[]>();
  showResultsBox = false;
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl('', Validators.minLength(2))
    });
  }

  goToSearchPage() {
    if (this.searchForm.get('search').value.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchForm.get('search').value.trim() } });
      this.searchForm.get('search').setValue('');
    }
  }

  searchSetup() {
    const searchString = this.searchForm.get('search').value.trim();
    if (!(searchString && this.searchForm.get('search').valid)) {
      this.quickSearchProcessedString = null;
      return;
    }
    if (searchString === this.quickSearchProcessedString) {
      return;
    }
    this.quickSearchProcessedString = null;
    if (this.applyResultsFromCache()) {
      return;
    }
    if (this.searchTimer) {
      window.clearTimeout(this.searchTimer);
    }
    this.searchTimer = window.setTimeout(() => {
      this.searchTimer = null;
      this.quickSearch();
    }, 500);
  }

  applyResultsFromCache() {
    const searchString = this.searchForm.get('search').value.trim();

    if (!this.searchInfoByString.has(searchString)) {
      this.showResultsBox = false;
      return false;
    }

    this.showResultsBox = !!this.searchInfoByString.get(searchString).length;
    this.quickSearchProcessedString = searchString;
    return true;
  }

  quickSearch() {
    const searchString = this.searchForm.get('search').value.trim();
    if (this.searchForm.get('search').invalid)
    {
      return;
    }
    if (searchString.length > 1) {
      this.moviesService.fetchMovieCardsResponse(
        SearchMode.ByString, searchString, 0, 1
      ).subscribe((response: MovieCardsGetResponse) => {
        this.searchInfoByString.set(searchString, response.results);
        this.showResultsBox = true;
      });
    }
  }

  goToMoviePage(movieCardId: number) {
    this.moviesService.movieActivated$.next(movieCardId);
    this.router.navigate(['/movie', movieCardId]);
    this.searchForm.get('search').setValue('');
  }
}
