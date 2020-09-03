import React from 'react';
import PropTypes from 'prop-types';
import '../css/main.css';
import moment from 'moment';
import 'moment/locale/ru';

function checkWeekend(arrayLength) {
    if (!((arrayLength + 1) % 7) || !((arrayLength + 2) % 7)) {
        return true;
    }
    return false;
}

function getPrevMonthDays(date) {
    //get previous month numbers
    let prevMonthArray = [];
    let daysArray = [];

    //get first day number of week    
    let numberDayOfWeek = moment(date).startOf('month').format('e');

    if (numberDayOfWeek > 0) {       
        let dateFrom = moment(date).subtract(1,'months').endOf('month');
        let lastDayPrevMonth = dateFrom.date();
        for (let i = numberDayOfWeek - 1; i >= 0; i--) {
            prevMonthArray.push(lastDayPrevMonth);
            lastDayPrevMonth--;
        }
        prevMonthArray.reverse();
        
        //form days array from prebious month
        daysArray = prevMonthArray.map((el, index) => (
            index === 5? //check is it weekend
                <td key={el} className="ui-datepicker-other-month ui-datepicker-week-end"> {el} </td> :
                <td key={el} className="ui-datepicker-other-month"> {el} </td>
        ));
    }
    return daysArray;
}

function addDaysOfInitMonth(date, daysArray) {
    let daysAmount = moment(date).endOf('month').date();
    let day = date.getDate();
    for (let i = 1; i <= daysAmount; i++) {
        let className = "";
        if (i === day) {
            className += "ui-datepicker-today ";
        }
        //check is it weekend
        if (checkWeekend(daysArray.length)) {
            className += "ui-datepicker-week-end";
        }

        daysArray.push(
            <td key={i} className={className}>{i}</td>
        )
    }    
}

function addNextMonthDays(mDate, daysArray) {
    let numberLastDayOfWeek = mDate.endOf('month').format('e');
    if (numberLastDayOfWeek < 6) { //days of week from 0 to 6
        for (let i = 1; i <= 6 - numberLastDayOfWeek; i++) {
            let className = "ui-datepicker-other-month ";
            if (checkWeekend(daysArray.length)) {
                className += "ui-datepicker-week-end";
            }
            daysArray.push(
                <td key={i} className={className}>{i}</td>
            )
        }
    }
}

function getTableData(daysArray) {
    let data = [];
    let weeksAmount = daysArray.length / 7;
    for (let i = 0; i < weeksAmount; i++) {
        data.push(<tr key={i}>{daysArray.filter((el, index) => {
            return ((index >= 7*i) && (index <= 7*i + 6));
        })}</tr>);
    }
    return data;
}

function Calendar(props) {
    const { date } = props;
    moment.locale('ru')
    let mDate = moment(date);

    let dayOfWeek = mDate.format('dddd').charAt(0).toUpperCase() + mDate.format('dddd').slice(1);
    let day = date.getDate();
    let monthCase = mDate.format('D MMMM');
    let year = date.getFullYear();
    let month = mDate.format('MMMM').charAt(0).toUpperCase() + mDate.format('MMMM').slice(1);

    //get previous month numbers
    let daysArray = getPrevMonthDays(date);

    // add days of init month
    addDaysOfInitMonth(date, daysArray);

    //add daues of next month
    addNextMonthDays(mDate, daysArray);
    
    //form result data
    let data = getTableData(daysArray);

    return (
        <div className="ui-datepicker">
            <div className="ui-datepicker-material-header">
                <div className="ui-datepicker-material-day">{dayOfWeek}</div>
                <div className="ui-datepicker-material-date">
                    <div className="ui-datepicker-material-day-num">{day}</div>
                    <div className="ui-datepicker-material-month">{monthCase}</div>
                    <div className="ui-datepicker-material-year">{year}</div>
                </div>
            </div>
            <div className="ui-datepicker-header">
                <div className="ui-datepicker-title">
                    <span className="ui-datepicker-month">{month}</span>&nbsp;<span className="ui-datepicker-year">{year}</span>
                </div>
            </div>
            <table className="ui-datepicker-calendar">
                <thead>
                <tr>
                    <th scope="col" title="Понедельник">Пн</th>
                    <th scope="col" title="Вторник">Вт</th>
                    <th scope="col" title="Среда">Ср</th>
                    <th scope="col" title="Четверг">Чт</th>
                    <th scope="col" title="Пятница">Пт</th>
                    <th className="ui-datepicker-week-end" scope="col" title="Суббота">Сб</th>
                    <th className="ui-datepicker-week-end" scope="col" title="Воскресенье">Вс</th>
                </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    )
}

Calendar.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired
}

export default Calendar;