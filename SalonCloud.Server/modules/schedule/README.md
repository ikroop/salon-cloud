Schedule Module
=================
**File Structure**

 1. ScheduleModel.ts
 2. ScheduleData.ts
 3. ScheduleBehavior.ts
 4. SalonSchedule.ts
 5. EmployeeSchedule.ts
 
**ScheduleModel.ts**
```
export const WeeklySchema = new mongoose.Schema({
.......
});
export const DailySchema = new mongoose.Schema({
.......
})

export const ScheduleSchema = new mongoose.Schema({
	salon:{
		salon_id: { type: String, required: true },
		weekly: [WeeklySchema],
		daily: [DailySchema]
	},
	employee:{
		salon_id: { type: String, required: true },
		employee_id: { type: String, required: true },
		weekly: [WeeklySchema],
		daily: [DailySchema]
	}
})
module.exports = mongoose.model<ScheduleData>('schedule', ScheduleSchema);
```
**ScheduleData.ts**
```
export interface WeeklyData{
}
export interface DailyData{
}
export interface ScheduleData{
}
```
**ScheduleBehavior.ts**
```
export interface ScheduleBehavior{
	getSchedule(from:Date, to:Date);
	......
}
```
**SalonSchedule.ts**
```
class SalonSchedule implements ScheduleBehavior{
	.......
}
```
**EmployeeSchedule.ts**
```
class EmployeeSchedule implements ScheduleBehavior{
	.......
}
```
