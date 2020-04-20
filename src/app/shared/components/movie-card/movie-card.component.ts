import {Component, Input, OnInit} from '@angular/core';
import {MovieCard} from '../../interfaces';
import {Router} from '@angular/router';
import {MoviesService} from '../../movies.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() movieCard: MovieCard;

  constructor(
    private router: Router,
    private moviesService: MoviesService
  ) { }

  ngOnInit(): void {
  }

  goToMoviePage(movieCardId: number) {
    this.router.navigate(['/movie', movieCardId]);
    this.moviesService.movieActivated$.next(movieCardId);
  }
}
