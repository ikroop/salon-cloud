# Timestamp
use UTC.
# Database Structure
```
[root]
  |
  |----user
  |     |----id: string
  |     |----username(phonenumber or email): string
  |     |----status: boolean
  |     |----is_verified: boolean                 
  |     |----is_temporary: boolean (account is created automatic after customer books appointment)
  |     |----profile: Array
  |           |----salon_id: string
  |           |----status: boolean
  |           |----role: number, 1: Owner, 2: Manager, 3: Employee, 4: Customer
  |           |----fullname: string  
  |           |----nickname: string
  |           |----social_security_number: string (optional) //TODO: bring it outside
  |           |----salary_rate: double (optional)
  |           |----cash_rate: double (optional)
  |           |----birthday: string (optional) //TODO: bring it outside
  |           |----address: string (optional) //TODO: bring it outside, add phone too
  |----appointment
  |     |----id: string
  |     |----salon_id: string
  |     |----comment: string
  |     |----device: number, 1: phone, 2: web, 3: app
  |     |----appointment_items:Array
  |     |     |----id: string
  |     |     |----employee_id: string
  |     |     |----service
  |     |     |     |----service_id: string
  |     |     |     |----service_name: string
  |     |     |     |----time: number
  |     |     |     |----price: number
  |     |     |----start: SalonTime
  |     |     |----overlapped:
  |     |           |----status: boolean
  |     |           |----appointment_id: string (optional)
  |     |----customer_id(uid): string
  |     |----status: number, 1: booked, 2: checked in, 3: in-process, 4: done, 5: paid
  |     |----type: number, 1: booking, 2: check-in
  |     |----is_reminded: boolean
  |----customer
  |     |----uid: string
  |     |----last_appointment: timestamp
  |     |----total_spent: number
  |----discount
  |----finance
  |----giftcard
  |----weeklySchedule
  |     |     |----_id: string //db id
  |     |     |----salon_id: string
  |     |     |----employee_id: string
  |     |     |----week: array
  |     |     |     |----close: number
  |     |     |     |----open: number
  |     |     |     |----status: boolean
  |     |     |     |----day_of_week: number
  |----dailySchedule
  |     |     |----_id: string //db id
  |     |     |----salon_id: string
  |     |     |----employee_id: string
  |     |     |----day
  |     |           |----close: number
  |     |           |----open: number
  |     |           |----status: boolean
  |     |           |----date: number
  |     |             
  |----service
  |     |----id: string
  |     |----salon_id: string
  |     |----group_name: string
  |     |----description: string
  |     |----service_list
  |           |----id: string
  |           |----name: string
  |           |----price: number
  |           |----time: number
  |----salon
  |     |----id: string
  |     |----setting
  |     |     |----appointment_reminder: boolean
  |     |     |----flexible_time: number
  |     |     |----technician_checkout: boolean
  |     |----information
  |           |----salon_name: string
  |           |----phone
  |           |     |----number: string
  |           |     |----is_verified: boolean
  |           |----location
  |           |     |----address: string
  |           |     |----is_verified: boolean
  |           |     |----timezone: number
  |           |----email: string
  |----domain
```
