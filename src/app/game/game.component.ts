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
	public ExamsPerLevel: number = 8;
	
	public level = 1;
	public levelCount = 1;
	public isSolutionVisible=false;
	public isGameFinished = false;
	private levels: ExamInstance[][] = [];
	public score = 0;
	
	public isRewardShown:boolean = false;
	public rewardsHtmlCode = "";
	
	private availableRewardsList:string[] = [];
	
	public examInstance:ExamInstance=
		{
			metainfo: {},
			question: "",
			questionlist: [],
			solution: "",
			solutionlist: [],
			subject: "",
			supplements: [],
			solved: false
		};
	public solution;
	
	constructor(private examService: ExamService, public highscoreService:HighscoreService) {}
	
	getRandomNumber(lowerBound, upperBound)
	{
		return Math.floor(lowerBound + Math.random() * (upperBound-lowerBound));
	}
	
	getRandomExam():ExamInstance
	{
		//var levelIndex = this.getRandomNumber(0, this.levels.length);
		var levelIndex = this.level-1;
		var randomExam = this.getRandomNumber(0, this.levels[levelIndex].length);
		return this.levels[levelIndex][randomExam];
	}
	
	showReward()
	{
		this.isRewardShown = true;
		this.rewardsHtmlCode = this.availableRewardsList[this.getRandomNumber(0, this.availableRewardsList.length)];
		var self = this;
		setTimeout(function(){ self.isRewardShown = false; }, 3500);
	}
	
	setRandomExam()
	{
		let exam = this.getRandomExam();
		
		// look for exam, which has not already been solved
		while(exam.hasOwnProperty("solved")) {
			exam = this.getRandomExam();
		}
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
	
	enterLevel()
	{
		var self = this;
		this.examService.getExamsByLevel(this.level).subscribe(
			level => {
				self.levels.push(level);
				self.setRandomExam();
			});
	}
	
	checkExam(exam:ExamInstance)
	{
		let isAnswerCorrect = this.isExamAnswerCorrect(this.examInstance, this.solution);
		if(!isAnswerCorrect){
			this.isSolutionVisible = true;
			this.score = 0;
		}
		else {
			this.score += 1;
			this.examInstance.solved = true;
			this.setRandomExam();
			if(this.score >= this.ExamsPerLevel)
			{
				if(this.level < this.levelCount)
				{
					this.level += 1;
					this.score = 0;
					var self = this;
					setTimeout(function(){ self.enterLevel() }, 2500);
					this.showReward();
				}
				else
				{
					this.isGameFinished = true;
				}
			}
			else
			{
				this.showReward();
			}
		}
	}
	
	ngOnInit()
	{
		var self = this;
		this.enterLevel();
		this.examService.getRewardsList().subscribe(rewardsList => { 
			self.availableRewardsList = rewardsList; 
		});
		this.levelCount = this.examService.getLevelCount();
	}

}
