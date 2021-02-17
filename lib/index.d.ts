export declare type CalendarStructureOptions = {
    sixWeeksPerMonth: boolean;
    weekStartDay: number;
    actualDate: Date;
    languageCode: string;
};
/**
 *
 * @param options.sixWeeksPerMonth true/false
 * @param options.weekStartDay 0-6 which day the week starts on
 * @param options.actualDate current date of calendar
 * @param options.languageCode BCP 47 language tag
 */
export default function CalendarStructure(options?: CalendarStructureOptions): void;
