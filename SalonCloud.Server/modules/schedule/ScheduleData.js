"use strict";
;
;
;
class Schedule {
    /*
    constructor(public id, public salon_id, public close, public open, public status) {
    }

    createProfile(profileData: UserProfile, callback) {
        UserModel.findOne({ "_id": this.UserId }, function (err, docs) {
            if (err) {
                callback(undefined);
            }
            if (docs) {
                docs.profile.push(profileData);
                docs.save();
                callback(docs);
            }
        });
    }*/
    constructor(id, salonId, close, open, status) {
        this.id = id;
        this.salon_id = salonId;
        this.close = close;
        this.open = open;
        this.status = status;
    }
    exportProfile() {
        let scheduleProfile = {
            _id: this.id,
            salon_id: this.salon_id,
            // employee_id: string,
            // created_date: Date,
            // last_modified: Date,
            // created_by: <UserProfile>,
            close: this.close,
            open: this.open,
            status: this.status
        };
        return scheduleProfile;
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=ScheduleData.js.map