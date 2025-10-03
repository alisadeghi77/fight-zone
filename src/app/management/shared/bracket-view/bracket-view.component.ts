import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MatchDto } from 'src/app/shared/models/match.models';

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

  groupedMatches: { [round: number]: MatchDto[] } = {};
  rounds: number[] = [];

  ngOnInit(): void {
    this.groupMatchesByRound();
  }

  ngOnChanges(): void {
    this.groupMatchesByRound();
  }

  private groupMatchesByRound(): void {
    this.groupedMatches = {};
    this.matches.forEach(match => {
      if (!this.groupedMatches[match.round]) {
        this.groupedMatches[match.round] = [];
      }
      this.groupedMatches[match.round].push(match);
    });

    // Sort matches within each round by match number position
    Object.keys(this.groupedMatches).forEach(round => {
      this.groupedMatches[+round].sort((a, b) => a.matchNumberPosition - b.matchNumberPosition);
    });

    // Sort rounds in descending order (finals first, then semifinals, etc.)
    this.rounds = Object.keys(this.groupedMatches).map(r => +r).sort((a, b) => b - a);
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
      return match.firstParticipantFullName || 'نامشخص';
    } else {
      if (match.isSecondParticipantBye) {
        return 'Bye';
      }
      return match.secondParticipantFullName || 'نامشخص';
    }
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

  isWinner(match: MatchDto, isFirst: boolean): boolean {
    if (isFirst) {
      return match.winnerParticipantId === match.firstParticipantId;
    } else {
      return match.winnerParticipantId === match.secondParticipantId;
    }
  }
}
