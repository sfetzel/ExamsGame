import { Component, OnInit } from '@angular/core';
import { HighscoreService } from '../highscore.service';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css'],
  providers: [ ]
})
export class NameComponent implements OnInit {

	constructor(public highscoreService:HighscoreService) { }

	ngOnInit() {
	}

}
