import { SemesterStartDay } from './constants'

export interface CampusDateInfo {
    week: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    dayString: string;
}

export const weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

export function GetTodayWeekday(): CampusDateInfo{
    let now = new Date();
    let duraction = now.valueOf() - SemesterStartDay.valueOf();
    let week = Math.floor(duraction/(86400*7*1000)) + 1;
    let day = Math.floor(duraction%(86400*7*1000)/(86400*1000));
    let hour = Math.floor(duraction%(86400*1000)/(3600*1000));
    let minute = Math.floor(duraction%(3600*1000)/(60*1000));
    let second = Math.floor(duraction%(60*1000)/1000);
    return {
        week, day, hour, minute, second, dayString: weekdays[day]
    }
}

export function WeekdayToDate(week: number, day: number): Date {
    let duraction = (week-1)*86400*7*1000 + day*86400*1000;
    return new Date(SemesterStartDay.valueOf() + duraction);
}