export interface AlarmRelationOptions {
    includeUser?: boolean;         // Include related User entity (N:1 relation)
    includeAlarmType?: boolean;    // Include AlarmType enum details
}