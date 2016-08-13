# Database Structure
```
[root]
  |
  |------user
  |       |----username(phonenumber or email): string
  |       |----password: string
  |       |----fullname: string
  |       |----salon:
  |             |----<id>
  |                   |----salonid: string
  |                   |----status: boolean
  |                   |----role: number
  |------salon
  |       |----appointment
  |       |     |----<id>
  |       |           |----comment: string
  |       |           |----device: number
  |       |           |----employee
  |       |           |     |----<id>
  |       |           |           |----uid: string
  |       |           |           |----service
  |       |           |                 |----<id>
  |       |           |                       |----service_id: string
  |       |           |                       |----realized_time: number
  |       |           |                       |----realized_price: number
  |       |           |----end: timestamp
  |       |           |----flexible
  |       |           |     |----status: boolean
  |       |           |     |----appointment_id: string
  |       |           |----customer_id(uid): string
  |       |           |----no: number
  |       |           |----start: timestamp
  |       |           |----status: number
  |       |           |----type: number
  |       |----customer
  |       |     |----<id>
  |       |           |----uid: string
  |       |           |----birthday: string
  |       |           |----address: string
  |       |           |----last_appointment: timestamp
  |       |           |----total_spent: number
  |       |----discount
  |       |----employee
  |       |     |----<id>
  |       |           |----uid: string
  |       |           |----nickname: string
  |       |           |----social_security_number: string
  |       |           |----salary_rate: double
  |       |           |----cash_rate: double
  |       |----finance
  |       |----giftcard
  |       |----schedule
  |       |     |----salon
  |       |     |     |----weekly
  |       |     |     |     |----0
  |       |     |     |     |    |----close: number
  |       |     |     |     |    |----open: number
  |       |     |     |     |    |----status: boolean
  |       |     |     |     |    |----dayofweek: number
  |       |     |     |     |----1
  |       |     |     |          |----close: number
  |       |     |     |          |----open: number
  |       |     |     |          |----status: boolean
  |       |     |     |          |----dayofweek: number
  |       |     |     |     .............
  |       |     |     |----daily
  |       |     |           |----<id>
  |       |     |                 |----close: number
  |       |     |                 |----open: number
  |       |     |                 |----status: boolean
  |       |     |                 |----date: number
  |       |     |          
  |       |     |----emplopyee
  |       |           |----<uid>
  |       |                 |----weekly
  |       |                 |     |----0
  |       |                 |     |    |----close: number
  |       |                 |     |    |----open: number
  |       |                 |     |    |----status: boolean
  |       |                 |     |    |----dayofweek: number
  |       |                 |     |----1
  |       |                 |          |----close: number
  |       |                 |          |----open: number
  |       |                 |          |----status: boolean
  |       |                 |          |----dayofweek: number
  |       |                 |     .............
  |       |                 |----daily
  |       |                       |----<id>
  |       |                             |----close: number
  |       |                             |----open: number
  |       |                             |----status: boolean
  |       |                             |----date: number            
  |       |----service
  |       |     |----<id>
  |       |           |----group_name: string
  |       |           |----description: string
  |       |           |----service_list
  |       |                |----<id>
  |       |                       |----name: string
  |       |                       |----price: number
  |       |                       |----time: number
  |       |----setting
  |------domain
```
