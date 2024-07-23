import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input() disabled!: boolean;
  @Output() iconClick = new EventEmitter();

  public onClick(): void {
    if (!this.disabled) {
      this.iconClick.emit();
    }
  }
}
