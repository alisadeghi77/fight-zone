import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { start } from '@popperjs/core';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { CompetitionParam, CompetitionParamValue } from 'src/app/shared/models/competition.models';
import { MinimalUserDto } from 'src/app/shared/models/user.models';

@Component({
  selector: 'app-register-params-competition',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    NgbTypeaheadModule
  ],
  templateUrl: './register-params-competition.html',
  styleUrl: './register-params-competition.scss'
})
export class RegisterParamsCompetitionComponent implements OnChanges {
  private _paramData!: CompetitionParam;

  @Input()
  set paramData(value: CompetitionParam) {
    if (value) {
      this._paramData = value;
      this.buildForm();
    }
  }
  get paramData(): CompetitionParam {
    return this._paramData;
  }

  @Output() selectionChange = new EventEmitter<{ key: string; value: string }[]>();

  form!: FormGroup;
  currentParams: CompetitionParam[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paramData'] && this.paramData) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    if (!this.paramData) return;

    this.form = this.fb.group({});
    this.currentParams = [this.paramData];
    this.addControl(this.paramData);

    this.form.valueChanges.subscribe(() => {
      const selected = this.getSelections();
      this.selectionChange.emit(selected);
    });
  }

  private addControl(param: CompetitionParam): void {
    this.form.addControl(param.key, this.fb.control(''));
  }

  onSelectChange(param: CompetitionParam, event: any): void {
    debugger
    const valueKey = event.target.value
    // Remove deeper params if parent changes
    const index = this.currentParams.findIndex(p => p.key === param.key);
    this.currentParams = this.currentParams.slice(0, index + 1);

    // Reset deeper controls
    Object.keys(this.form.controls).forEach(key => {
      if (!this.currentParams.find(p => p.key === key)) {
        this.form.removeControl(key);
      }
    });

    // Add children if available
    const selectedValue = param.values?.find(v => v.key === valueKey);
    if (selectedValue?.params) {
      selectedValue.params.forEach(child => {
        this.currentParams.push(child);
        this.addControl(child);
      });
    }

    // Reset children values
    this.form.patchValue(
      this.currentParams.reduce((acc, p) => ({ ...acc, [p.key]: this.form.get(p.key)?.value || '' }), {}),
      { emitEvent: true }
    );
  }

  private getSelections(): { key: string; value: string }[] {
    return this.currentParams
      .map(p => {
        const val = this.form.get(p.key)?.value;
        return val ? { key: p.key, value: val } : null;
      })
      .filter((x): x is { key: string; value: string } => !!x);
  }
}
