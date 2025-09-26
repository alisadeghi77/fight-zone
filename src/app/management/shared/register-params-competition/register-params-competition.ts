import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { start } from '@popperjs/core';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { CompetitionParam, CompetitionParamValue } from 'src/app/shared/models/competition.models';
import { MinimalUserDto } from 'src/app/shared/models/user.models';


interface CurrentNode {
  param: CompetitionParam;
  ancestors: string[]; // keys of ancestor params (closest parent last)
}

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
  currentNodes: CurrentNode[] = [];
  private formValueSub?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paramData'] && this.paramData) {
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    this.formValueSub?.unsubscribe();
  }

  private buildForm(): void {
    // unsubscribe previous subscription if exists
    this.formValueSub?.unsubscribe();

    if (!this.paramData) {
      this.form = this.fb.group({});
      this.currentNodes = [];
      return;
    }

    // create a fresh form and initial node list (root param)
    this.form = this.fb.group({});
    this.currentNodes = [{ param: this.paramData, ancestors: [] }];

    // ensure root control exists
    if (!this.form.contains(this.paramData.key)) {
      this.form.addControl(this.paramData.key, this.fb.control(''));
    }

    // emit flatten selection on value changes
    this.formValueSub = this.form.valueChanges.subscribe(() => {
      this.selectionChange.emit(this.getSelections());
    });
  }

  // ---- FIXED onSelectChange (see explanation above) ----
  onSelectChange(param: CompetitionParam, event: any): void {
    const valueKey = event?.target ? event.target.value : event;

    // find the metadata node for this param
    const node = this.currentNodes.find(n => n.param.key === param.key);
    if (!node) return;

    // 1) remove descendant nodes (those whose ancestors include this param.key)
    const descendants = this.currentNodes.filter(n => n.ancestors.includes(param.key));
    descendants.forEach(d => {
      if (this.form.contains(d.param.key)) {
        this.form.removeControl(d.param.key);
      }
    });

    // keep only nodes that are NOT descendants (and keep the current node itself)
    this.currentNodes = this.currentNodes.filter(n => !n.ancestors.includes(param.key));

    // 2) add new children (if the newly selected value exposes params)
    const selectedValue = param.values?.find(v => v.key === valueKey);
    if (selectedValue?.params) {
      selectedValue.params.forEach(childParam => {
        const childNode: CurrentNode = {
          param: childParam,
          ancestors: [...node.ancestors, param.key]
        };

        // avoid duplicates
        const exists = this.currentNodes.some(n =>
          n.param.key === childNode.param.key &&
          n.ancestors.join('|') === childNode.ancestors.join('|')
        );
        if (!exists) {
          this.currentNodes.push(childNode);
          if (!this.form.contains(childParam.key)) {
            this.form.addControl(childParam.key, this.fb.control(''));
          }
          // reset its value without triggering form.valueChanges
          this.form.get(childParam.key)?.setValue('', { emitEvent: false });
        }
      });
    }

    // emit current selections (we used emitEvent:false above, so emit explicitly)
    this.selectionChange.emit(this.getSelections());
  }

  private getSelections(): { key: string; value: string }[] {
    return this.currentNodes
      .map(n => {
        const val = this.form.get(n.param.key)?.value;
        return val ? { key: n.param.key, value: val } : null;
      })
      .filter((x): x is { key: string; value: string } => !!x);
  }
}