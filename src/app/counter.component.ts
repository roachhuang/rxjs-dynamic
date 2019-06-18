import { Subject, merge, Observable, UnaryFunction, pipe, combineLatest, timer, NEVER } from 'rxjs';
import { mapTo, map, startWith, scan, shareReplay, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {

  initialCounterState = {
    isTicking: false,
    count: 0,
    countUp: true,
    tickSpeed: 200,
    countDiff: 1
  };
  count = this.initialCounterState.count;

  btnStart$: Subject<Event> = new Subject<Event>();
  btnPause$: Subject<Event> = new Subject<Event>();
  btnUp$: Subject<Event> = new Subject<Event>();
  btnDown$: Subject<Event> = new Subject<Event>();
  btnReset$: Subject<Event> = new Subject<Event>();
  btnSetTo$: Subject<Event> = new Subject<Event>();
  inputTickSpeed$: Subject<Event> = new Subject<Event>();
  inputCountDiff$: Subject<Event> = new Subject<Event>();
  inputSetTo$: Subject<Event> = new Subject<Event>();
  // === STATE OBSERVABLES ==================================================
  programmaticCommandSubject = new Subject();
  counterCommands$ = merge(
    this.btnStart$.pipe(mapTo({ isTicking: true })),
    this.btnPause$.pipe(mapTo({ isTicking: false })),
    // this.btnSetTo$.pipe(map(n => ({ count: n }))),
    this.inputSetTo$.pipe(map(n => ({ count: n }))),
    this.btnUp$.pipe(mapTo({ countUp: true })),
    this.btnDown$.pipe(mapTo({ countUp: false })),
    this.btnReset$.pipe(mapTo({ ...this.initialCounterState })),
    this.inputTickSpeed$.pipe(map(n => ({ tickSpeed: n }))),
    this.inputCountDiff$.pipe(map(n => ({ countDiff: n }))),
    // this.programmaticCommandSubject.asObservable()
  );

  counterState$ = this.counterCommands$
    .pipe(
      startWith(this.initialCounterState),
      scan((counterState, command) => ({ ...counterState, ...command })),
      shareReplay(1)
    )

  // === INTERACTION OBSERVABLES ============================================
  // == INTERMEDIATE OBSERVABLES ============================================
  count$ = this.counterState$.pipe(
    pluck('count'),
    distinctUntilChanged<number>()
  );
  isTicking$ = this.counterState$.pipe(
    pluck('isTicking'),
    distinctUntilChanged<boolean>()
  );
  tickSpeed$ = this.counterState$.pipe(
    pluck('tickSpeed'),
    distinctUntilChanged<number>()
  );
  countDiff$ = this.counterState$.pipe(
    pluck('countDiff'),
    distinctUntilChanged<number>()
  );

  counterUpdateTrigger$ = combineLatest([this.isTicking$, this.tickSpeed$])
    .pipe(
      switchMap(([isTicking, tickSpeed]) => isTicking ? timer(0, tickSpeed) : NEVER)
  )
    .subscribe(c => {
      this.count = c;
  })
  // == OPERATORS ===========================================================
  queryChange<T, I>(key: string): UnaryFunction<Observable<T>, Observable<I>> {
    return pipe(
      pluck<T, I>(key),
      distinctUntilChanged<I>()
    );
  }
}
