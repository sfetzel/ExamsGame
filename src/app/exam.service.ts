import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


export interface ExamsJsonExportData
{
	feedbackQuestions: string[];
	questions: ExamInstance[];
}

export interface ExamInstance
{
	metainfo: any;
	question: string;
	questionlist: string[];
	solution: string;
	solutionlist: string[];
	subject: string;
	supplements: string[];
}


export interface ExamsJsonExport
{
	exportData: ExamsJsonExportData;
}


@Injectable()
export class ExamService
{
	public levelsRelativeUrl = "assets/level{0}.json";
	
	// default count of levels
	private levelCount = 1;

	constructor(private http: HttpClient)
	{
		if(environment.hasOwnProperty("levelsRelativeUrl"))
		{
			this.levelsRelativeUrl = environment.levelsRelativeUrl;
		}
	}

	getExamsByLevel(level:number):Observable<ExamInstance[]>
	{
		var relativeUrl = this.levelsRelativeUrl.replace(
			new RegExp('\\{0\\}', 'gm'), level.toString());
		return this.http.get<ExamsJsonExport>(relativeUrl).pipe(map(
			(examsJsonExport:ExamsJsonExport) => examsJsonExport.exportData.questions));

	}
	
	getLevelCount():number
	{
		let levelCount = this.levelCount;
		if(environment.hasOwnProperty("levelCount")){
			levelCount = environment.levelCount;
		}
		return levelCount;
	}
}

