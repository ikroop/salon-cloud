Schedule Module
=================
**File Structure**
```
----/
 |---- ScheduleModel.ts
 |---- ScheduleData.ts
 |---- ScheduleBehavior.ts
 |---- SalonSchedule.ts
 |---- EmployeeSchedule.ts
```
 
**ScheduleModel.ts**
```
export const WeeklySchema = new mongoose.Schema({
.......
});
export const DailySchema = new mongoose.Schema({
.......
})

export const ScheduleSchema = new mongoose.Schema({
	_id: <salon_id>
	salon:{
		weekly: [WeeklySchema],
		daily: [DailySchema]
	},
	employee:[{
		employee_id: { type: String, required: true },
		weekly: [WeeklySchema],
		daily: [DailySchema]
	}]
}, { _id: false })
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
    	private Schedule:ScheduleData;
    	constructor(id:string){
    		.....
    		this.Schedule.id = id;
    	}
    	getSchedule(){
    		return Schedule;
    	}
	.......
}
```
**EmployeeSchedule.ts**
```
class EmployeeSchedule implements ScheduleBehavior{
	.......
}
```
