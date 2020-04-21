import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {FavouritesService} from '../../favourites.service';

@Component({
  selector: 'app-favorites-button',
  templateUrl: './favorites-button.component.html',
  styleUrls: ['./favorites-button.component.scss']
})
export class FavoritesButtonComponent implements OnChanges, OnInit, OnDestroy {

  @Input() movieId: number;
  inFavourites: boolean;
  changes$: Subject<boolean>;

  constructor(
    public favService: FavouritesService
  ) { }

  ngOnChanges() {
    this.inFavourites = this.favService.inFavourites(this.movieId);
    this.changes$ = this.favService.subscribeToChanges(this.movieId);
    this.changes$.subscribe(() => {
      this.inFavourites = this.favService.inFavourites(this.movieId);
    });
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.favService.unsubscribeFromChanges(this.movieId, this.changes$);
    this.changes$.unsubscribe();
  }
}
