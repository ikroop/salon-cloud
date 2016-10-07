
import { mongoose } from "../../services/database";
import {ServiceItemData, ServiceGroupData} from './ServiceData'

export const ServiceItemSchema = new mongoose.Schema(
    {
        id: { type: String, required: false },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        time: { type: Number, required: true }
    },
    {
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    }
);

export const ServiceGroupSchema = new mongoose.Schema(
    {
        id: { type: String, required: false },
        salon_id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: false },
        service_list: [ServiceItemSchema]
    },
    {
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    }
);

export const ServiceItemModel = mongoose.model<ServiceItemData>('ServiceItem', ServiceItemSchema);
export const ServiceGroupModel = mongoose.model<ServiceGroupData>('ServiceGroup', ServiceGroupSchema);
