# Timestamp
use UTC.
# Database Structure
```
[root]
  |
  |----user
  |     |----id: string
  |     |----username(phonenumber or email): string
  |     |----password: string
  |     |----fullname: string
  |     |----status: boolean
  |     |----is_verified: boolean                        
  |     |----birthday: string
  |     |----address: string
  |     |----is_temporary: boolean (account is created automatic after customer books appointment)
  |     |----salon:
  |           |----<id>
  |           |----salon_id: string
  |           |----status: boolean
  |           |----role: number
  |           |----nickname: string
  |           |----social_security_number: string
  |           |----salary_rate: double
  |           |----cash_rate: double
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
  |----schedule
  |     |----salon
  |     |     |----salon_id: string
  |     |     |----weekly
  |     |     |     |----id: 0 (1,2,3,4,5,6)
  |     |     |     |----close: number
  |     |     |     |----open: number
  |     |     |     |----status: boolean
  |     |     |     |----dayofweek: number
  |     |     |     .............
  |     |     |----daily
  |     |           |----id: string
  |     |           |----close: number
  |     |           |----open: number
  |     |           |----status: boolean
  |     |           |----date: number
  |     |             
  |     |----emplopyee
  |           |----employee_id(uid): string
  |           |----salon_id: string
  |           |----weekly
  |           |     |----id: 0(1,2,3,4,5,6)
  |           |     |----close: number
  |           |     |----open: number
  |           |     |----status: boolean
  |           |     |----dayofweek: number
  |           |----daily
  |                 |----id: string
  |                 |----close: number
  |                 |----open: number
  |                 |----status: boolean
  |                 |----date: number            
  |----service
  |     |----id: string
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
  |     |     |----appointment_reminder
  |     |     |     |----status: boolean
  |     |     |----flexible_time
  |     |     |     |----time: number
  |     |     |----technician_checkout
  |     |           |---status: boolean
  |     |----information
  |           |----salon_name: string
  |           |----phone
  |           |     |----number: string
  |           |     |----is_verified: boolean
  |           |----location
  |           |     |----address: string
  |           |     |----is_verified: boolean
  |           |----email: string
  |----domain
```
