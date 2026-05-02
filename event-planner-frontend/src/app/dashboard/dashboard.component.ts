import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { EventService } from 'src/Services/event.service';
import { AuthService } from 'src/Services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  loading: boolean = true;
  currentUser: any;

  // Pie Chart - Events par catégorie
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#880e4f','#ad1457','#c2185b','#e91e63','#f06292','#f48fb1','#fce4ec','#4a148c'] }]
  };
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'right' } }
  };

  // Bar Chart - Inscriptions par mois
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
    datasets: [
      { data: [], label: 'Inscriptions', backgroundColor: '#ad1457' }
    ]
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } }
  };

  // Doughnut Chart - Statut des événements
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut', number[], string> = {
    labels: ['Actifs', 'Archivés'],
    datasets: [{ data: [0, 0], backgroundColor: ['#ad1457', '#e0e0e0'] }]
  };
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadStats();
  }

  loadStats(): void {
    this.eventService.getDashboardStats().subscribe({
      next: (data: any) => {
        this.stats = data;
        this.loading = false;
        this.updateCharts(data);
      },
      error: () => {
        this.loading = false;
        this.stats = { total_events: 0, total_categories: 0, total_registrations: 0, total_users: 0 };
      }
    });
  }

  updateCharts(data: any): void {
    if (data.events_by_category) {
      this.pieChartData = {
        labels: data.events_by_category.map((c: any) => c.name),
        datasets: [{
          data: data.events_by_category.map((c: any) => c.events_count),
          backgroundColor: ['#880e4f','#ad1457','#c2185b','#e91e63','#f06292','#f48fb1','#fce4ec','#4a148c']
        }]
      };
    }
    if (data.events_by_status) {
      this.doughnutChartData = {
        labels: ['Actifs', 'Archivés'],
        datasets: [{
          data: [data.events_by_status.actif || 0, data.events_by_status.archive || 0],
          backgroundColor: ['#ad1457', '#e0e0e0']
        }]
      };
    }
    if (data.registrations_by_month) {
      const months = new Array(12).fill(0);
      data.registrations_by_month.forEach((r: any) => {
        months[r.month - 1] = r.count;
      });
      this.barChartData = {
        labels: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
        datasets: [{ data: months, label: 'Inscriptions', backgroundColor: '#ad1457' }]
      };
    }
  }
}
