```
root
  |----users
  |     |----<user_id>
  |           |----salons
  |           |     |----<salon_id>
  |           |           |----status: boolean
  |           |           |----role: number
  |           |           |----fullname: string
  |           |           |----nickname: string
  |           |           |----social_security_number: string (optional)
  |           |           |----salary_rate: double (optional)
  |           |           |----cash_rate: double (optional)
  |           |           |----birthday: string (optional)
  |           |           |----address: string (optional)
  |           |----phone
  |           |     |----number: string
  |           |     |----is_verified: boolean
  |           |----is_temporary: boolean           
  |----salons
  |     |----<salon_id>
  |     |     |----settings
  |     |     |     |----appointment_reminder: boolean
  |     |     |     |----flexible_time: number
  |     |     |     |----technician_checkout: boolean
  |     |     |----information
  |     |     |     |----salon_name: string
  |     |     |     |----phone
  |     |     |     |     |----number: string
  |     |     |     |     |----is_verified: boolean
  |     |     |     |----location
  |     |     |     |     |----address: string
  |     |     |     |     |----is_verified: boolean
  |     |     |     |     |----timezone: number
  |     |     |     |----email
  |     |     |           |----address: string
  |     |     |           |----is_verified: boolean
  |     |     |----service_groups
  |     |     |     |----<service_group_id>
  |     |     |           |----group_name: string
  |     |     |           |----description: string
  |     |     |           |----service_list
  |     |     |                 |----<service_id>
  |     |     |                       |----name: string
  |     |     |                       |----price: number
  |     |     |                       |----time: number
  |     |     |----schedule
  |     |     |     |----daily
  |     |     |     |     |----<daily_id>
  |     |     |     |           |----employee_id: string
  |     |     |     |                 |----day
  |     |     |     |                       |----close: number
  |     |     |     |                       |----open: number
  |     |     |     |                       |----status: boolean
  |     |     |     |                       |----date: SalonTime
  |     |     |     |----weekly
  |     |     |           |----close: number
  |     |     |           |----open: number,
  |     |     |           |----status: true,
  |     |     |           |----day_of_week: number
  |     |     |----appointments
  |     |     |     |----<appointment_id>
  |     |     |           |----comment: string
  |     |     |           |----device: number, 1: phone, 2: web, 3: app
  |     |     |           |----appointment_items:Array
  |     |     |           |----id: string
  |     |     |           |----employee_id: string
  |     |     |           |----services
  |     |     |           |     |----<service_id>
  |     |     |           |           |----service_name: string
  |     |     |           |           |----time: number
  |     |     |           |           |----price: number
  |     |     |           |----start: SalonTime
  |     |     |           |----overlapped:
  |     |     |           |     |----status: boolean
  |     |     |           |     |----appointment_id: string (optional)
  |     |     |           |----customer_id(uid): string
  |     |     |           |----status: number, 1: booked, 2: checked in, 3: in-process, 4: done, 5: paid
  |     |     |           |----type: number, 1: booking, 2: check-in
  |     |     |           |----is_reminded: boolean
  ```
