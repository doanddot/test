import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButton } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { iif, Subject, takeUntil, tap, throwError } from "rxjs";
import { ApiError, BookCreate, BookPublic, BooksService, BookUpdate, RolePublic } from '@app/shared';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-book-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'book-dialog.component.scss',
  templateUrl: 'book-dialog.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatChipsModule,
    MatButton,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInput,
    MatSelectModule,
  ]
})
export class BookDialogComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  protected bookId: number;
  protected roles: RolePublic[];

  protected bookForm = new FormGroup({
    year: new FormControl<number | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    publisher: new FormControl<string | null>(null, Validators.required),
    pages: new FormControl<number | null>(null, Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private matDialogData: { book?: BookPublic },
    private matDialogRef: MatDialogRef<BookDialogComponent>,
    private matSnackBar: MatSnackBar,

    private booksService: BooksService,
  ) {
    const book = this.matDialogData.book;
    if (book) {
      this.bookId = book.id;
      this.bookForm.patchValue(book);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected save(): void {
    if (this.bookForm.valid) {
      iif(
        () => !!this.bookId,
        this.booksService.patchBooksBookId(this.bookId, this.bookForm.value as BookUpdate),
        this.booksService.postBooks(this.bookForm.value as BookCreate)
      ).pipe(
        tap(() => {
          this.matDialogRef.close();
        }),
        catchError((err: ApiError) => {
          this.matSnackBar.open(JSON.stringify(err.body), "OK", { duration: 10000 });

          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
    }

    this.bookForm.markAllAsTouched();
  }
}
