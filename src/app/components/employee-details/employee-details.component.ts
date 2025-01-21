import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BambooApiService } from '../../services/bamoboo-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: string | null = null;
  employee: any;
  manager: any = null;
  workLocation: any = null;
  homeLocation: any = null;

  constructor(
    private route: ActivatedRoute,
    private bambooApiService: BambooApiService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.fetchEmployeeDetails(this.employeeId);
    }
  }

  fetchEmployeeDetails(id: string): void {
    this.bambooApiService.getEmployeeDetails(id).subscribe(
      (response) => {
        this.employee = response;

        // Fetch additional data
        if (response.manager) {
          this.fetchManagerDetails(response.manager);
        }
        if (response.work_location) {
          this.fetchLocation(response.work_location);
        }
        if (response.home_location) {
          this.fetchLocation(response.home_location, true);
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  fetchManagerDetails(managerId: string): void {
    const formattedId = managerId.startsWith('urn:uuid:')
      ? managerId.replace('urn:uuid:', '')
      : managerId;

    this.bambooApiService.getEmployeeDetails(formattedId).subscribe(
      (response) => {
        this.manager = response;
      },
      (error) => {
        console.error('Error fetching manager details:', error);
      }
    );
  }

  fetchLocation(locationId: string, isHome: boolean = false): void {
    const formattedId = locationId.startsWith('urn:uuid:')
      ? locationId.replace('urn:uuid:', '')
      : locationId;

    this.bambooApiService.getLocation(formattedId).subscribe(
      (response) => {
        if (isHome) {
          this.homeLocation = response;
        } else {
          this.workLocation = response;
        }
      },
      (error) => {
        console.error('Error fetching location:', error);
      }
    );
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const names = fullName.split(' ');
    return names.map((n) => n[0]).join('').toUpperCase();
  }
}
