import { Component, OnInit } from '@angular/core';
import { DataService, TitanicPassenger } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  isLoading = true;
  
  survivalRateData: any[] = [];
  classSurvivalData: any[] = [];
  genderSurvivalData: any[] = [];
  ageDistributionData: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTitanicData().subscribe({
      next: (data) => {
        const validData = data.filter(p => p.survived !== null && (p.survived === 0 || p.survived === 1));
        this.processDataForCharts(validData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load or parse Titanic data", err);
        this.isLoading = false;
      }
    });
  }

  private processDataForCharts(data: TitanicPassenger[]): void {
    const survived = data.filter(p => p.survived === 1).length;
    const notSurvived = data.length - survived;
    this.survivalRateData = [
      { name: 'Survived', value: survived },
      { name: 'Did not Survive', value: notSurvived }
    ];

    this.classSurvivalData = [1, 2, 3].map(pclass => {
      const classData = data.filter(p => p.pclass === pclass);
      const totalInClass = classData.length;
      const survivedInClass = classData.filter(p => p.survived === 1).length;
      const survivalRate = totalInClass > 0 ? (survivedInClass / totalInClass) * 100 : 0;
      return {
        name: `Class ${pclass}`,
        value: survivalRate.toFixed(2)
      };
    });

    const maleSurvived = data.filter(p => p.sex === 'male' && p.survived === 1).length;
    const femaleSurvived = data.filter(p => p.sex === 'female' && p.survived === 1).length;
    this.genderSurvivalData = [
      { name: 'Male', value: maleSurvived },
      { name: 'Female', value: femaleSurvived }
    ];

    const passengersWithAge = data.filter(p => p.age !== null && p.age >= 0);
    const ageBins: { [key: string]: number } = {
      '0-10': 0,
      '11-20': 0,
      '21-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51-60': 0,
      '61+': 0
    };

    passengersWithAge.forEach(p => {
      const age = p.age!;

      if (age <= 10) {
        ageBins['0-10']++;
      } else if (age <= 20) {
        ageBins['11-20']++;
      } else if (age <= 30) {
        ageBins['21-30']++;
      } else if (age <= 40) {
        ageBins['31-40']++;
      } else if (age <= 50) {
        ageBins['41-50']++;
      } else if (age <= 60) {
        ageBins['51-60']++;
      } else {
        ageBins['61+']++;
      }
      
    });

    this.ageDistributionData = Object.entries(ageBins).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }
}
