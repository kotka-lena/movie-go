import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {MoviePageComponent} from './movie-page/movie-page.component';
import {SearchPageComponent} from './search-page/search-page.component';
import {FavoritesPageComponent} from './favorites-page/favorites-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'movie/:id', component: MoviePageComponent},
  { path: 'search', component: SearchPageComponent},
  { path: 'favourites', component: FavoritesPageComponent},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
