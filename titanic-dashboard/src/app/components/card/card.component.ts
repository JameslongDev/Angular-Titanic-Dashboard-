import { Component, Input } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, NgSwitch, NgSwitchCase, CommentSectionComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title!: string;
  @Input() chartId!: string;
  @Input() chartType: 'pie' | 'bar' = 'pie';
  @Input() chartData: any[] = [];
  @Input() showLegend = true;
  @Input() showLabels = true;

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#3b5998', '#8a2be2', '#ff7f50']
  };
}