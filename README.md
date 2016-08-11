# salon-cloud
SalonCloud – a software will change all your definition about managing a salon to a high new level.
# Database Structure
```
[root]
|
|------user
|       |----phone: string
|       |----password: string
|       |----Email: string
|       |----salon:
|             |----<id>
|                   |----salonid: string
|                   |----status: boolean
|                   |----type: number
|------salon
|       |----appointment
|       |----customer
|       |----discount
|       |----employee
|       |----finance
|       |----giftcard
|       |----schedule
|             |----salon
              |     |----weekly
              |     |     |----0
              |     |     |    |----close: number
              |     |     |    |----open: number
              |     |     |    |----status: boolean
              |     |     |    |----dayofweek: number
              |     |     |----1
              |     |          |----close: number
              |     |          |----open: number
              |     |          |----status: boolean
              |     |          |----dayofweek: number
              |     |     .............
              |     |----daily
              |     |     |----<id>
              |     |           |----close: number
              |     |           |----open: number
              |     |           |----status: boolean
              |     |           |----date: number
              |     |     
              |----emplopyee
|       |----service
|       |----setting
|------domain
```
