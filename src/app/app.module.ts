import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ExamService } from './exam.service';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from './MathJaxDirective';
import { AppRoutingModule } from './app-routing.module';
import { NameComponent } from './name/name.component';
import { GameComponent } from './game/game.component';
import { HighscoreService } from './highscore.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MathJaxDirective,
    NameComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ 
  	HighscoreService, 
  	{ provide: LOCALE_ID, useValue: 'de' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
