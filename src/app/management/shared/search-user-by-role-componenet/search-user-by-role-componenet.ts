import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeahead, NgbNavModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs';
import { UserHttpService } from 'src/app/shared/http-services/user-http-service';
import { MinimalUserDto, UserRoles } from 'src/app/shared/models/user.models';
import { DatePickerComponent } from 'src/app/theme/shared/components/date-picker/date-picker.component';
import { FileUploadComponent } from 'src/app/theme/shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-search-user-by-role-componenet',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NgbTypeahead],
  templateUrl: './search-user-by-role-componenet.html',
  styleUrl: './search-user-by-role-componenet.scss'
})
export class SearchUserByRoleComponenet {
  @Input() role: UserRoles;

  @Output() valueChange = new EventEmitter<MinimalUserDto | string>();

  form!: FormGroup;

  constructor(private userService: UserHttpService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      searchInput: new FormControl<MinimalUserDto | string>('')
    });

    this.form.get('searchInput')?.valueChanges.subscribe(val => {
      this.valueChange.emit(val);
    });

  }


  private fetchSuggestions(query: string): Observable<MinimalUserDto[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    return this.userService.getUsersByRole(query, this.role).pipe(map(s => s.data));
  }

  search = (text$: Observable<string>): Observable<readonly MinimalUserDto[]> => text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.fetchSuggestions(term)));


  resultFormatter = (item: MinimalUserDto) => `${item.fullName} (${item.phoneNumber})`;

  inputFormatter = (item: MinimalUserDto | string) => typeof item === 'string' ? item : `${item.fullName} (${item.phoneNumber})`;



  onSelect(event: NgbTypeaheadSelectItemEvent) {
    this.valueChange.emit(event.item);
  }

}
