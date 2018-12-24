import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable()
export class HighscoreService
{
	public name:string;
	
	constructor(private http: HttpClient)
	{

	}
}

