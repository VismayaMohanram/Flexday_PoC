import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BambooApiService } from '../../services/bamoboo-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];
  searchQuery: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 20; // Display 20 employees per page
  totalPages: number = 0;

  constructor(
    private bambooApiService: BambooApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.bambooApiService.getEmployees().subscribe(
      (response) => {
        this.employees = response.results || [];
        this.filteredEmployees = [...this.employees];
        this.calculatePagination();
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  filterEmployees(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) =>
      employee.display_full_name?.toLowerCase().includes(query)
    );
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  getInitials(fullName: string | null | undefined): string {
    if (!fullName) {
      return 'NA'; // Default initials for null or undefined names
    }
    const names = fullName.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  }

  goToEmployeeDetails(employeeId: string): void {
    this.router.navigate([`/employees/${employeeId}`]);
  }
}
