import { Component } from '@angular/core';
import { BambooApiService } from '../../services/bamoboo-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
  employee: any = {
    remote_id: '',
    employee_number: '',
    first_name: '',
    last_name: '',
    display_full_name: '',
    work_email: '',
    gender: '',
    date_of_birth: '',
    employment_status: '',
    custom_fields: {},
  };

  constructor(private bambooApiService: BambooApiService) {}

  /**
   * Add a new employee.
   */
  addEmployee(): void {

    const payload = {
      model: { ...this.employee },
    };

    this.bambooApiService.addEmployee(payload).subscribe(
      (response) => {
        alert('Employee added successfully!');
      },
      (error) => {
        console.error('Error adding employee:', error);

        // Display detailed error message
        if (error.error?.errors?.length) {
          const apiErrors = error.error.errors.map(
            (err: any) => `${err.title}: ${err.detail} (${err.source?.pointer})`
          );
          alert(`Failed to add employee:\n${apiErrors.join('\n')}`);
        } else {
          alert('Failed to add employee. Please check the data and try again.');
        }
      }
    );
  }
}
