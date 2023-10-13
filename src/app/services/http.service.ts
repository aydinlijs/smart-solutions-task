import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  headers: HttpHeaders = new HttpHeaders({});

  constructor(private http: HttpClient) {}

  get(url: string, headers = {}, params = {}) {}

  save(url: string, body = {}) {}

  delete(url: string, params = {}) {}
}
