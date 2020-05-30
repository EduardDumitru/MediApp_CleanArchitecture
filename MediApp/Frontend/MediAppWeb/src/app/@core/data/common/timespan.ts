import { SelectItemsList, SelectItem } from './selectitem';

export class TimeSpan {
    hours: number;
    minutes: number;

    constructor(hours: number, minutes: number) {
        this.hours = hours;
        this.minutes = minutes;
    }

    public minutesSelectList: SelectItemsList =
    {selectItems: [{label: '0', value: '0'} as SelectItem, {label: '30', value: '30'} as SelectItem]};
    public hoursSelectList: SelectItemsList =
    {selectItems: [{label: '0', value: '0'} as SelectItem, {label: '1', value: '1'} as SelectItem, {label: '2', value: '2'} as SelectItem,
    {label: '3', value: '3'} as SelectItem, {label: '4', value: '4'} as SelectItem, {label: '5', value: '5'} as SelectItem,
    {label: '6', value: '6'} as SelectItem, {label: '7', value: '7'} as SelectItem, {label: '8', value: '8'} as SelectItem,
    {label: '9', value: '9'} as SelectItem, {label: '10', value: '10'} as SelectItem, {label: '11', value: '11'} as SelectItem,
    {label: '12', value: '12'} as SelectItem, {label: '13', value: '13'} as SelectItem, {label: '14', value: '14'} as SelectItem,
    {label: '15', value: '15'} as SelectItem, {label: '16', value: '16'} as SelectItem, {label: '17', value: '17'} as SelectItem,
    {label: '18', value: '18'} as SelectItem, {label: '19', value: '19'} as SelectItem, {label: '20', value: '20'} as SelectItem,
    {label: '21', value: '21'} as SelectItem, {label: '22', value: '22'} as SelectItem, {label: '23', value: '23'} as SelectItem]};

    public toString() : string {
        if (this.hours <= 9 && this.minutes <= 9) {
            return `0${this.hours}:0${this.minutes}:00`;
        } else if (this.hours <= 9) {
            return `0${this.hours}:${this.minutes}:00`;
        } else if (this.minutes <= 9) {
            return `${this.hours}:0${this.minutes}:00`;
        } else {
            return `${this.hours}:${this.minutes}:00`;
        }
    }
}