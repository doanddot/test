import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, forkJoin, Observable, of, Subject, switchMap, takeUntil, tap } from "rxjs";

import { DrawerComponent } from "@app/drawer";
import { RailService } from "@app/rail";
import { BookPublic, BooksService } from "@app/shared";

import { AsyncPipe } from '@angular/common';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';


@Component({
  selector: 'app-book-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'book-list.component.scss',
  templateUrl: 'book-list.component.html',
  imports: [
    MatCard,
    MatTableModule,

    DrawerComponent,
    AsyncPipe,
  ]
})
export class BookListComponent implements AfterViewInit, OnInit,OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  protected columns = ['id', 'year', 'title', 'publisher', 'pages',];
  protected books$ = new BehaviorSubject<BookPublic[]>([]);

  constructor(
    private activatedRoute: ActivatedRoute,

    private matDialog: MatDialog,

    private railService: RailService,

    private booksService: BooksService,
  ) {
    const { books } = this.activatedRoute.snapshot.data;

    this.books$.next(books);
  }

  ngOnInit(): void {
    this.railService.tooltip = 'Добавить книгу';
    this.railService.click$.pipe(
      tap(() => {
        this.openDialog();
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected openDialog(bookId?: number): void {
    const sources$: Observable<any>[] = [];

    sources$.push(bookId ? this.booksService.getBooksBookId(bookId) : of(null))

    forkJoin(sources$).pipe(
      switchMap(([book]) => {
        const dialogRef = this.matDialog.open(
          BookDialogComponent,
          {
            autoFocus: false,
            data: { book },
            width: '560px'
          }
        );

        return dialogRef.afterClosed();
      }),
      switchMap(() => this.booksService.getBooks()),
      tap((books) => {
        this.books$.next(books);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
