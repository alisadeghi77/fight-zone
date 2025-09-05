import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, input, OnInit, PipeTransform } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { Observable, startWith, map, tap, debounceTime } from 'rxjs';
import { CompetitionHttpService } from 'src/app/shared/http-services/competition-http-service';
import { CompetitionDto } from 'src/app/shared/models/competition.models';

@Component({
  selector: 'app-competitions-component',
  providers: [CompetitionHttpService],
  imports: [ReactiveFormsModule],
  templateUrl: './competitions-component.html',
  styleUrl: './competitions-component.scss'
})
export class CompetitionsComponent implements OnInit {

  input: FormControl = new FormControl();
  competitions: CompetitionDto[] = [];
  filteredDate: CompetitionDto[] = [];

  constructor(private competitionService: CompetitionHttpService) { }

  ngOnInit(): void {
    this.loadCompetitions();
    this.input.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filteredDate = value ? this.competitions.filter(f => f.title.indexOf(value)) : this.competitions;
    })
  }

  loadCompetitions(): void {
    this.competitionService.getCompetitions()
      .subscribe(data => {
        this.competitions = data
        this.filteredDate = data
      });
  }
}
