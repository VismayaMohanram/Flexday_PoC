import { Component, OnInit } from '@angular/core';
import { BambooApiService } from '../../services/bamoboo-api.service';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalEmployees: number = 0;
  activeEmployees: number = 0;
  pendingEmployees: number = 0;
  terminatedEmployees: number = 0;
  recentEmployees: any[] = [];
  locationNames: { [key: string]: string } = {};
  groups: any[] = [];

  // Chart instances
  private statusChart: Chart | null = null;
  private locationsChart: Chart | null = null;

  constructor(private bambooApiService: BambooApiService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchEmployeeData();
    this.fetchGroups();
  }

  /**
   * Fetch employee data and calculate summaries.
   */
  fetchEmployeeData(): void {
    this.bambooApiService.getEmployees().subscribe(
      (response: any) => {
        const employees = response.results;
        this.totalEmployees = employees.length;
        this.activeEmployees = employees.filter((e: { employment_status: string; }) => e.employment_status === 'ACTIVE').length;
        this.pendingEmployees = employees.filter((e: { employment_status: string; }) => e.employment_status === 'PENDING').length;
        this.terminatedEmployees = employees.filter((e: { employment_status: string; }) => e.employment_status === 'TERMINATED').length;
        this.recentEmployees = employees.slice(0, 5); // Show the latest 5 employees
        this.fetchLocationNames(employees);
        this.renderStatusChart(employees);
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  /**
   * Fetch location names for employees.
   */
  fetchLocationNames(employees: any[]): void {
    const locationIds = [...new Set(employees.map((e) => e.work_location).filter((id) => id))];
    locationIds.forEach((id) => {
      this.bambooApiService.getLocation(id).subscribe(
        (response: any) => {
          this.locationNames[id] = response.name || 'Unknown';
          this.renderLocationsChart();
        },
        (error) => {
          console.error(`Error fetching location ${id}:`, error);
        }
      );
    });
  }

  /**
   * Fetch groups and their details.
   */
  fetchGroups(): void {
    this.bambooApiService.getGroups().subscribe(
      (response: any) => {
        this.groups = response.results.map((group: any) => ({
          name: group.name,
          type: group.type,
          is_commonly_used_as_team: group.is_commonly_used_as_team,
        }));
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  /**
   * Render the employment status chart.
   */
  renderStatusChart(employees: any[]): void {
    const statusCounts = {
      ACTIVE: employees.filter((e) => e.employment_status === 'ACTIVE').length,
      PENDING: employees.filter((e) => e.employment_status === 'PENDING').length,
      TERMINATED: employees.filter((e) => e.employment_status === 'TERMINATED').length,
    };

    // Destroy existing chart if it exists
    if (this.statusChart) {
      this.statusChart.destroy();
    }

    // Create new chart
    this.statusChart = new Chart('statusChart', {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Pending', 'Terminated'],
        datasets: [
          {
            data: [statusCounts.ACTIVE, statusCounts.PENDING, statusCounts.TERMINATED],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}`,
            },
          },
        },
      },
    });
  }

  /**
   * Render the employees by location chart.
   */
  renderLocationsChart(): void {
    const labels = Object.values(this.locationNames);
    const data = Object.keys(this.locationNames).map(
      (id) =>
        this.recentEmployees.filter((e) => e.work_location === id).length
    );

    // Destroy existing chart if it exists
    if (this.locationsChart) {
      this.locationsChart.destroy();
    }

    // Create new chart
    this.locationsChart = new Chart('locationsChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Employees',
            data,
            backgroundColor: '#42A5F5',
          },
        ],
      },
    });
  }

  refreshDashboard(): void {
    this.totalEmployees = 0;
    this.activeEmployees = 0;
    this.pendingEmployees = 0;
    this.terminatedEmployees = 0;
    this.groups = [];
    this.recentEmployees = [];
    this.locationNames = {};
  
    this.fetchEmployeeData();
    this.fetchGroups();
  }  
}
