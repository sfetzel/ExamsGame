import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ExamService } from './app.exam.service';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from './MathJaxDirective';

@NgModule({
  declarations: [
    AppComponent,
    MathJaxDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
