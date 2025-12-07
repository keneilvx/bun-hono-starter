import type { CreateHymnDTO } from "../Data/DTOs/HymnDTO";
import { Status } from "../Data/Enums/HymnStatuses";

export function PrivacyStatus(hymn_data: CreateHymnDTO){
    if (hymn_data.hymnal_id == null){
        hymn_data.status = Status.PRIVATE
    }
}