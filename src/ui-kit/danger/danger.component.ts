import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-danger',
  standalone: true,
  templateUrl: './danger.component.html',
  styleUrls: ['./danger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DangerComponent {
  @Input({ required: true }) status!: string | number;
}
