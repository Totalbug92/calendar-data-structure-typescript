var defaultOptions = {
    sixWeeksPerMonth: false,
    weekStartDay: 0,
    actualDate: new Date(),
    languageCode: 'default',
};
/**
 *
 * @param options.sixWeeksPerMonth true/false
 * @param options.weekStartDay 0-6 which day the week starts on
 * @param options.actualDate current date of calendar
 * @param options.languageCode BCP 47 language tag
 */
export default function CalendarStructure(options) {
    if (options === void 0) { options = defaultOptions; }
    this.options = {
        sixWeeksPerMonth: (options === null || options === void 0 ? void 0 : options.sixWeeksPerMonth) || false,
        weekStartDay: ((options === null || options === void 0 ? void 0 : options.weekStartDay) && options.weekStartDay < 7) ? options.weekStartDay : 0,
        actualDate: (options === null || options === void 0 ? void 0 : options.actualDate) || new Date(),
    };
    this.actualDate = this.options.actualDate;
    this.utils = this.utils();
}
CalendarStructure.prototype.getWeeksArr = function getWeeksArr() {
    var date = new Date(this.actualDate.getTime());
    var monthWeeks = [];
    var self = this;
    date.setDate(1);
    for (var i = 1; i <= 6; i++) {
        monthWeeks.push(self.getDaysArr(date));
        date.setDate(date.getDate() + 7);
    }
    if (!self.options.sixWeeksPerMonth && (monthWeeks[1][0].monthNumber !== monthWeeks[5][0].monthNumber)) {
        monthWeeks.pop();
    }
    return monthWeeks;
};
CalendarStructure.prototype.getDaysArr = function getDaysArr(date) {
    var weekDate = (date && (date.constructor === new Date().constructor)) ? new Date(date.getTime()) : new Date(this.actualDate.getTime());
    var daysToWeekStart = this.utils.daysToWeekStart(weekDate);
    var weekArr = [];
    weekDate.setHours(24 * daysToWeekStart);
    for (var i = 0; i < 7; i++) {
        weekArr[i] = this.utils.buildDayObj(weekDate);
        weekDate.setHours(+24);
    }
    return weekArr;
};
CalendarStructure.prototype.utils = function utils() {
    var self = this;
    var daysToWeekStart = function daysToWeekStart(weekDate) {
        var options = self.options;
        var diff = options.weekStartDay - weekDate.getDay();
        var result = (options.weekStartDay > weekDate.getDay()) ? (diff - 7) : diff;
        return result;
    };
    var buildDayObj = function buildDayObj(date) {
        return {
            dayText: self.languageData.days[date.getDay()],
            dayNumber: date.getDate(),
            monthText: date.toLocaleDateString(),
            monthNumber: date.getMonth(),
            year: date.getFullYear(),
        };
    };
    var updateDate = function updateDate(difference, t) {
        if (difference === void 0) { difference = 0; }
        var isInt = difference % 1 === 0;
        var types = {
            day: {
                set: 'setDate',
                get: 'getDate',
                multiplier: 1,
            },
            week: {
                set: 'setDate',
                get: 'getDate',
                multiplier: 7,
            },
            month: {
                set: 'setMonth',
                get: 'getMonth',
                multiplier: 1,
            },
            year: {
                set: 'setFullYear',
                get: 'getFullYear',
                multiplier: 1,
            },
        };
        var type = types[t] || false;
        if (difference !== 0 && isInt && type) {
            self.actualDate[type.set](self.actualDate[type.get]() + (difference * type.multiplier));
        }
    };
    return {
        daysToWeekStart: daysToWeekStart,
        buildDayObj: buildDayObj,
        updateDate: updateDate,
    };
};
/*
Set the actual date to another week
@params: difference {Integer 1...n} difference in days to set (could be negative)
*/
CalendarStructure.prototype.setOtherDay = function setOtherDay(difference) {
    this.utils.updateDate(difference, 'day');
};
/*
Set the actual date to another week
@params: difference {Integer 1...n} difference in weeks to set (could be negative)
*/
CalendarStructure.prototype.setOtherWeek = function setOtherWeek(difference) {
    this.utils.updateDate(difference, 'week');
};
/*
Set the actual date to another month
@params: difference {Integer 1...n} difference in months to set (could be negative)
*/
CalendarStructure.prototype.setOtherMonth = function setOtherMonth(difference) {
    this.utils.updateDate(difference, 'month');
};
/*
Set the actual date to another year
@params: difference {Integer 1...n} difference in years to set (could be negative)
*/
CalendarStructure.prototype.setOtherYear = function setOtherYear(difference) {
    this.utils.updateDate(difference, 'year');
};
