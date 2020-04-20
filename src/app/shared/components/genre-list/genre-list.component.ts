import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GenresService} from '../../genres.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent implements OnInit, OnDestroy {

  @Input() genreIds: number[];
  genreNames: string[] = [];
  gSub: Subscription;

  constructor(private genresService: GenresService) { }

  ngOnInit(): void {
    this.genreNames = this.genresService.getGenreNameList(this.genreIds);
    this.gSub = this.genresService.genresLoaded$.subscribe(() => {
      this.genreNames = this.genresService.getGenreNameList(this.genreIds);
    });
  }

  ngOnDestroy() {
    if (this.gSub) {
      this.gSub.unsubscribe();
    }
  }
}
