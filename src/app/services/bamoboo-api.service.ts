import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BambooApiService {
  private baseUrl = 'https://api.merge.dev/api/hris/v1';
  private authorizationToken = 'Bearer IPPG0dHgoQfKY84Sa_-eAawly4aeLpGd4ekPpQKxqjYruDqojw53rQ';
  private accountToken = 'DB6G-uhqySP8nXg23QdVi4EVE9UXB8DszRCMk_gt5CdQtm6-5CK7lQ';

  constructor(private http: HttpClient) {}

  /**
   * Helper method to get headers.
   * Adds Authorization header and optionally X-Account-Token.
   */
  private getHeaders(includeAccountToken: boolean = false): HttpHeaders {
    let headers = new HttpHeaders().set('Authorization', this.authorizationToken);

    if (includeAccountToken) {
      headers = headers.set('X-Account-Token', this.accountToken);
    }

    return headers;
  }

  /**
   * Fetch list of employees.
   * Requires Authorization and X-Account-Token headers.
   */
  getEmployees(): Observable<any> {
    const headers = this.getHeaders(true);
    return this.http.get(`${this.baseUrl}/employees`, { headers });
  }

  /**
   * Fetch details of a single employee.
   * Requires Authorization and X-Account-Token headers.
   */
  getEmployeeDetails(id: string): Observable<any> {
    const headers = this.getHeaders(true);
    return this.http.get(`${this.baseUrl}/employees/${id}`, { headers });
  }

  getLocation(id: string): Observable<any> {
    const headers = this.getHeaders(true);
    return this.http.get<any>(`${this.baseUrl}/locations/${id}`, { headers });
  }
  

  /**
   * Create a new employee.
   * Requires only the Authorization header.
   */
  createEmployee(data: any): Observable<any> {
    const headers = this.getHeaders(false);
    return this.http.post(`${this.baseUrl}/employees`, data, { headers });
  }

  /**
    * Fetch list of groups.
    * Requires Authorization and X-Account-Token headers.
  */
  getGroups(): Observable<any> {
    const headers = this.getHeaders(true); // Include X-Account-Token
    return this.http.get(`${this.baseUrl}/groups`, { headers });
  }

  /**
   * Update an existing employee.
   * The `id` is included in the URL, and the updated data is sent in the request body.
 */
  updateEmployee(id: string, data: any): Observable<any> {
    const headers = this.getHeaders(true);
    return this.http.post(`${this.baseUrl}/employees/${id}`, data, { headers });
  }

  /**
 * Add a new employee.
 * Sends a POST request to `/employees` with required data.
 */
addEmployee(data: any): Observable<any> {
  const headers = this.getHeaders(true); // Ensure headers are included
  const url = `${this.baseUrl}/employees?is_debug_mode=true&run_async=true`;
  return this.http.post(url, data, { headers });
}


  /**
   * Delete an employee.
   * Requires only the Authorization header.
   */
  deleteEmployee(id: string): Observable<any> {
    const headers = this.getHeaders(false);
    return this.http.delete(`${this.baseUrl}/employees/${id}`, { headers });
  }
}
