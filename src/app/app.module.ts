import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MoviePageComponent } from './movie-page/movie-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { FavoritesPageComponent } from './favorites-page/favorites-page.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MovieComponent } from './shared/components/movie/movie.component';
import { MovieCardComponent } from './shared/components/movie-card/movie-card.component';
import { MovieCardListComponent } from './shared/components/movie-card-list/movie-card-list.component';
import { GenreListComponent } from './shared/components/genre-list/genre-list.component';
import { FavoritesButtonComponent } from './shared/components/favorites-button/favorites-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MoviePageComponent,
    SearchPageComponent,
    FavoritesPageComponent,
    HeaderComponent,
    FooterComponent,
    MovieComponent,
    MovieCardComponent,
    MovieCardListComponent,
    GenreListComponent,
    FavoritesButtonComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
