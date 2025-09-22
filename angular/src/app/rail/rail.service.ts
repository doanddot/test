import { Injectable } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";


@Injectable()
export class RailService {

  click$ = new Subject<void>();
  tooltip$ = new ReplaySubject<string>(1);

  set tooltip(value: string) {
    this.tooltip$.next(value);
  }

}