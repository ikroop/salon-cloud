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
  |           |----role: number
  |           |----fullname: string
  |           |----nickname: string
  |           |----social_security_number: string (optional)
  |           |----salary_rate: double (optional)
  |           |----cash_rate: double (optional)
  |           |----birthday: string (optional)
  |           |----address: string (optional)
  |----appointment
  |     |----id: string
  |     |----salon_id: string
  |     |----comment: string
  |     |----device: number
  |     |----employee
  |     |     |----<id>
  |     |     |----employee_id(uid): string
  |     |     |----service
  |     |     |----<id>
  |     |     |----service_id: string
  |     |     |----realized_time: number
  |     |     |----realized_price: number
  |     |----end: timestamp
  |     |----flexible
  |     |----status: boolean
  |     |----appointment_id: string
  |     |----customer_id(uid): string
  |     |----no: number
  |     |----start: timestamp
  |     |----status: number
  |     |----type: number
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
