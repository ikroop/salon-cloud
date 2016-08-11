# salon-cloud
SalonCloud – a software will change all your definition about managing a salon to a high new level.
# Database Structure
```
[root]
|
|------user
|       |----phone(username): string
|       |----password: string
|       |----fullname: string
|       |----Email: string
|       |----salon:
|             |----<id>
|                   |----salonid: string
|                   |----status: boolean
|                   |----type: number
|------salon
|       |----appointment
|       |----customer
|       |     |----<id>
|       |           |----uid: string
|       |           |----birthday: string
|       |           |----address: string
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
|       |     |     |----<uid>
|       |     |           |----weekly
|       |     |           |     |----0
|       |     |           |     |    |----close: number
|       |     |           |     |    |----open: number
|       |     |           |     |    |----status: boolean
|       |     |           |     |    |----dayofweek: number
|       |     |           |     |----1
|       |     |           |          |----close: number
|       |     |           |          |----open: number
|       |     |           |          |----status: boolean
|       |     |           |          |----dayofweek: number
|       |     |           |     .............
|       |     |           |----daily
|       |     |                 |----<id>
|       |     |                       |----close: number
|       |     |                       |----open: number
|       |     |                       |----status: boolean
|       |     |                       |----date: number            
|       |----service
|       |----setting
|------domain
```
