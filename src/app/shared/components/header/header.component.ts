import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MoviesService} from '../../movies.service';
import {MovieCardsGetResponse, SearchMode} from '../../interfaces';
import {SearchParams} from '../../classes';
import {fromEvent, Observable, merge} from 'rxjs';
import {
  switchMap,
  debounceTime,
  filter,
  map, tap
} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('searchInput', {static: true}) searchInputRef: ElementRef;
  response$: Observable<MovieCardsGetResponse> = new Observable<MovieCardsGetResponse>();
  error = false;
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
    const fromKeyUp = fromEvent(this.searchInputRef.nativeElement, 'keyup').pipe(
      debounceTime(500),
      map((event: any) => event.target.value.trim()),
      filter((searchString: string) => searchString.length > 1)
    );
    const fromClick = fromEvent(this.searchInputRef.nativeElement, 'click').pipe(
      map((event: any) => event.target.value.trim()),
      filter((searchString: string) => searchString.length > 1)
    );
    this.response$ = merge(fromKeyUp, fromClick).pipe(
      switchMap((searchString: string) => this.search(searchString))
    );
  }

  search(searchString: string): Observable<MovieCardsGetResponse> {
    const searchParams: SearchParams = new SearchParams(SearchMode.ByString, searchString, 0, 1);
    return this.moviesService.getMovieCardsResult(searchParams).pipe(
      tap({
        next: () => { this.showResultsBox = true; },
        error: () => { this.error = true; }
    }));
  }

  goToSearchPage(searchString: string) {
    if (searchString.length < 2) { return; }
    this.moviesService.queryActivated$.next(searchString);
    this.router.navigate(['/search'], { queryParams: { q: searchString } });
    this.clearForm();
  }

  goToMoviePage(movieCardId: number) {
    this.moviesService.movieActivated$.next(movieCardId);
    this.router.navigate(['/movie', movieCardId]);
    this.clearForm();
  }

  clearForm() {
    this.searchForm.get('search').setValue('');
    this.showResultsBox = false;
  }

  onClickedOutside(event: Event) {
    this.showResultsBox = false;
  }
}
