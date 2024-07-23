import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() disabled!: boolean;
  @Input() additionalClass!: string;
  @Output() clickEl = new EventEmitter();

  get className(): string {
    return `button ${this.additionalClass}`;
  }

  onClick(): void {
    this.clickEl.emit();
  }
}
