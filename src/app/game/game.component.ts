import { Component, OnInit } from '@angular/core';
import { HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { HighscoreService } from '../highscore.service';
import { ExamService, ExamInstance } from '../exam.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [ ExamService ],
  animations:
  [
  	trigger('answerState', [
	  	state('incorrectAnswer', style({
	  		backgroundColor: '#FF6161',
	  		color: 'white'
	  	})),
	  	state('noAnswer', style({})),
	  	transition('noAnswer => incorrectAnswer', [
	  		animate('0.2s')
	  	]),
	  	transition('incorrectAnswer => noAnswer', [
	  		animate('0.5s')
	  	])
  	])
  ]
})
export class GameComponent implements OnInit
{
	public level = 1;
	public levelCount = 1;
	public isSolutionVisible=false;
	private levels: ExamInstance[][] = [];
	public score = 0;
	public isRewardShown:boolean = false;
	
	public examInstance:ExamInstance=
		{
			metainfo: {},
			question: "",
			questionlist: [],
			solution: "",
			solutionlist: [],
			subject: "",
			supplements: []
		};
	public solution;
	
	// count of points to enter next level
	public necessaryPointsForNextLevel = 10;
	
	constructor(private examService: ExamService, private highscoreService:HighscoreService) {}
	
	getRandomNumber(lowerBound, upperBound)
	{
		return Math.floor(lowerBound + Math.random() * (upperBound-lowerBound));
	}
	
	getRandomExam():ExamInstance
	{
		var randomLevel = this.getRandomNumber(0, this.levels.length-1);
		var randomExam = this.getRandomNumber(0, this.levels[randomLevel].length);
		return this.levels[randomLevel][randomExam];
	}
	
	setRandomExam()
	{
		let exam = this.getRandomExam();
		this.isSolutionVisible = false;
		this.solution = "";
		this.isRewardShown = false;
		
		if(exam != null)
		{
			if(!(exam.questionlist instanceof Array)) {
				exam.questionlist = [exam.questionlist];
			}
			if(!(exam.solutionlist instanceof Array)) {
				exam.solutionlist = [exam.solutionlist];
			}
			if(exam.solution == undefined) {
				exam.solution = "";
			}
		
			if(exam.hasOwnProperty("metainfo"))
			{
				if(exam.metainfo.type == "mchoice")
				{
					this.solution = [];
					for(let solution in exam.questionlist) {
						this.solution.push();
					}
				}
			}
			this.examInstance = exam;
		}
	}
	
	isExamAnswerCorrect(exam:ExamInstance, solution:any)
	{
		let isAnswerCorrect = true;
		switch(exam.metainfo.type)
		{
			case "mchoice":
				exam.metainfo.solution.forEach((correctSolution, index) =>
				{
					if(correctSolution == true && solution[index] != true)
					{
						isAnswerCorrect = false;
					}
				});
				break;
			case "num":
				if(exam.metainfo.hasOwnProperty("tolerance"))
				{
					isAnswerCorrect = exam.metainfo.solution-exam.metainfo.tolerance <= solution && 
									exam.metainfo.solution+exam.metainfo.tolerance >= solution;
				}
				else
				{
					isAnswerCorrect = exam.metainfo.solution == solution;
				}
				break;
		}
		return isAnswerCorrect;
	}
	
	checkExam(exam:ExamInstance)
	{
		let isAnswerCorrect = this.isExamAnswerCorrect(this.examInstance, this.solution);
		if(!isAnswerCorrect){
			this.isSolutionVisible = true;
			this.score = 0;
			this.level = 1;
		}
		else {
			this.score += 1;
			this.setRandomExam();
			this.isRewardShown = true;
		}
		console.log(this.isRewardShown);
	}
	
	ngOnInit()
	{
		var self = this;
		this.examService.getExamsByLevel(1).subscribe(
			level => {
				self.levels = [ level ];
				self.setRandomExam();
			});
		this.levelCount = this.examService.getLevelCount();
	}

}
