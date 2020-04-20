import {Component, Input, OnInit} from '@angular/core';
import {GenresService} from '../../genres.service';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent implements OnInit {

  @Input() genreIds: number[];
  genreNames: string[] = [];

  constructor(private genresService: GenresService) { }

  ngOnInit(): void {
    this.genreNames = this.genresService.getGenreNameList(this.genreIds);
  }
}

