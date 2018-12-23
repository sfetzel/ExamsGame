import { Component } from '@angular/core';
import { ExamService, ExamInstance } from './app.exam.service';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [ExamService]
})
export class AppComponent {
	public title = 'app';
	public name = "";
	public level = 1;
	public isSolutionVisible=false;
	private levels: ExamInstance[][] = [];
	public score = 0;
	
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
	
	constructor(private examService: ExamService) { }
	
	getRandomNumber(lowerLevel, upperLevel)
	{
		return Math.floor(lowerLevel + Math.random() * (upperLevel-lowerLevel));
	}
	
	getRandomExam():ExamInstance
	{
		var randomLevel = this.getRandomNumber(0, this.levels.length);
		var randomExam = this.getRandomNumber(0, this.levels[randomLevel].length);
		return this.levels[randomLevel][randomExam];
	}
	
	setRandomExam()
	{
		this.examInstance = this.getRandomExam();
		this.isSolutionVisible = false;
		this.solution = "";
		
		if(!(this.examInstance.questionlist instanceof Array)) {
			this.examInstance.questionlist = [this.examInstance.questionlist];
		}
		if(!(this.examInstance.solutionlist instanceof Array)) {
			this.examInstance.solutionlist = [this.examInstance.solutionlist];
		}
		if(this.examInstance.solution == undefined) {
			this.examInstance.solution = "";
		}
		
		if(this.examInstance != null && this.examInstance.hasOwnProperty("metainfo"))
		{
			if(this.examInstance.metainfo.type == "mchoice")
			{
				this.solution = [];
				for(let solution in this.examInstance.questionlist) {
					this.solution.push();
				}
			}
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
				console.log(exam.metainfo.solution);
				console.log(solution);
				if(exam.metainfo.hasOwnProperty("tolerance"))
				{
					console.log(exam.metainfo.tolerance);
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
		}
	}
	
	ngOnInit()
	{
		var self = this;
		this.examService.getExamsByLevel(1).subscribe(
			level => {
				self.levels = [ level ];
				self.setRandomExam();
			});
	}
	
}
