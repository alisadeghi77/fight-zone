import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MatchDto } from 'src/app/shared/models/match.models';
import { MatchHttpService } from 'src/app/shared/http-services/match-http-service';

@Component({
  selector: 'app-bracket-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bracket-view.component.html',
  styleUrl: './bracket-view.component.scss'
})
export class BracketViewComponent implements OnInit, OnChanges {
  @Input() matches: MatchDto[] = [];
  @Input() competitionId?: string;
  @Input() keyId?: string;
  @Output() needRefresh = new EventEmitter<void>();

  roundGroupedMatches: { [round: number]: MatchDto[] } = {};
  rounds: number[] = [];

  constructor(private matchHttpService: MatchHttpService) { }

  ngOnInit(): void {
    this.groupMatchesByRound();
  }

  ngOnChanges(): void {
    this.groupMatchesByRound();
  }

  private groupMatchesByRound(): void {
    this.roundGroupedMatches = {};
    this.matches.forEach(match => {
      if (!this.roundGroupedMatches[match.round]) {
        this.roundGroupedMatches[match.round] = [];
      }
      this.roundGroupedMatches[match.round].push(match);
    });

    console.log(this.roundGroupedMatches);

    // Sort matches within each round by match number position
    Object.keys(this.roundGroupedMatches).forEach(round => {
      this.roundGroupedMatches[+round].sort((a, b) => b.matchNumberPosition - a.matchNumberPosition);
    });

    // Sort rounds in descending order (finals first, then semifinals, etc.)
    this.rounds = Object.keys(this.roundGroupedMatches).map(r => +r).sort((a, b) => b - a);
  }

  getRoundName(round: number): string {
    const roundNames: { [key: number]: string } = {
      2: 'فینال',
      4: 'نیمه نهایی',
      8: 'یک چهارم نهایی',
      16: 'یک هشتم نهایی',
      32: 'یک شانزدهم نهایی',
      64: 'یک سی و دوم نهایی'
    };
    return roundNames[round] || `دور ${round}`;
  }

  getParticipantDisplayName(match: MatchDto, isFirst: boolean): string {
    if (isFirst) {
      if (match.isFirstParticipantBye) {
        return 'Bye';
      }
      return match.firstParticipantFullName || '-';
    } else {
      if (match.isSecondParticipantBye) {
        return 'Bye';
      }
      return match.secondParticipantFullName || '-';
    }
  }

  getParticipantDisplayNameById(matchNo: number, roundNumber: number, isFirst: boolean) {
    const match = this.roundGroupedMatches[roundNumber].filter(f => f.matchNumberPosition == matchNo)[0]
    console.log(matchNo, roundNumber, match);
  }

  getCoachDisplayName(match: MatchDto, isFirst: boolean): string {
    if (isFirst) {
      if (match.isFirstParticipantBye) {
        return '';
      }
      return match.firstParticipantCoachFullName || '';
    } else {
      if (match.isSecondParticipantBye) {
        return '';
      }
      return match.secondParticipantCoachFullName || '';
    }
  }

  onParticipantClick(match: MatchDto, isFirst: boolean): void {
    const isBye = isFirst ? match.isFirstParticipantBye : match.isSecondParticipantBye;
    const participantId = isFirst ? match.firstParticipantId : match.secondParticipantId;

    if (isBye || !participantId) {
      return;
    }

    this.matchHttpService.setMatchWinner(match.id, participantId).subscribe({
      next: (response) => {
        this.needRefresh.emit();
      },
      error: (error) => {
        console.error('Error setting winner:', error);
        // Handle error (show toast notification, etc.)
      }
    });
  }
}
