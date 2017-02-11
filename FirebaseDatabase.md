```
root
  |----users
  |     |----<user_id>
  |           |----phone
  |           |     |----number: string
  |           |     |----is_verified: boolean
  |           |----email
  |           |     |----addess: string
  |           |     |----is_verified: boolean
  |           |----is_temporary: boolean
  |           |----fullname: string   
  |           |----salons
  |                 |----<salon_id>
  |                       |----status: boolean
  |----salons
  |     |----<salon_id>
  |           |----users
  |           |     |----<user_id>
  |           |           |----status: boolean
  |           |           |----role: number
  |           |           |----nickname: string
  |           |           |----social_security_number: string (optional)
  |           |           |----salary_rate: double (optional)
  |           |           |----cash_rate: double (optional)
  |           |           |----birthday: string (optional)
  |           |           |----address: string (optional)
  |           |----profile  
  |                 |----settings
  |                 |     |----appointment_reminder: boolean
  |                 |     |----flexible_time: number
  |                 |     |----technician_checkout: boolean
  |                 |----information
  |                 |     |----salon_name: string
  |                 |     |----phone
  |                 |     |     |----number: string
  |                 |     |     |----is_verified: boolean
  |                 |     |----location
  |                 |     |     |----address: string
  |                 |     |     |----is_verified: boolean
  |                 |     |     |----timezone: number
  |                 |     |----email
  |                 |           |----address: string
  |                 |           |----is_verified: boolean
  |           |----service_groups
  |           |     |----<service_group_id>
  |           |           |----group_name: string
  |           |           |----description: string
  |           |           |----service_list
  |           |                 |----<service_id>
  |           |                       |----name: string
  |           |                       |----price: number
  |           |                       |----time: number
  |           |----schedule
  |           |     |----daily
  |           |     |     |----employees
  |           |     |     |    |----<employee_id>
  |           |     |     |           |----<daily_id>: string
  |           |     |     |                 |----close: number
  |           |     |     |                 |----open: number
  |           |     |     |                 |----status: boolean
  |           |     |     |                 |----date: SalonTime
  |           |     |     |----salon
  |           |     |           |----<daily_id>
  |           |     |                 |----close: number
  |           |     |                 |----open: number
  |           |     |                 |----status: boolean
  |           |     |                 |----date: SalonTime  
  |           |     |----weekly
  |           |           |----salon: Array
  |           |           |     |----close: number
  |           |           |     |----open: number,
  |           |           |     |----status: true,
  |           |           |     |----day_of_week: number
  |           |           |----employees:
  |           |                 |----<employee_id>:Array
  |           |                       |----close: number
  |           |                       |----open: number,
  |           |                       |----status: true,
  |           |                       |----day_of_week: number       
  |           |----appointments
  |           |     |----<appointment_id>
  |           |           |----comment: string
  |           |           |----device: number, 1: phone, 2: web, 3: app
  |           |           |----customer_id(uid): string
  |           |           |----status: number, 1: booked, 2: checked in, 3: in-process, 4: done, 5: paid
  |           |           |----type: number, 1: booking, 2: check-in
  |           |           |----is_reminded: boolean
  |           |----appointment_items
  |                       |----<id>
  |                             |----<appointment_id>: string
  |                             |----employee_id: string
  |                             |----services
  |                             |     |----<service_id>
  |                             |           |----service_name: string
  |                             |           |----time: number
  |                             |           |----price: number
  |                             |----start: SalonTime
  |                             |----overlapped:
  |                             |     |----status: boolean
  |                             |     |----appointment_id: string (optional)
  |----verifications
  |     |----<id>
  |           |----code: string
  |           |----activated: boolean
  |           |----phone: string
  |           |----timestamp: number
  ```
