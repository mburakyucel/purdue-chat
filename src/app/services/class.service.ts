import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Class, Sub } from '../../assets/class';
import { CLASSES } from '../../assets/mock-classes';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private subsUrl = 'api/subs';  // URL to web api

  constructor() { }

	//Show all available classes
  getClasses(): Observable<Class[]> {
  return of(CLASSES);
	}
}
