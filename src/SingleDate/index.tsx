import * as React from "react";
import "./index.css";

const WEEKS: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_DISPLAY: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const LEAP_MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const NORMAL_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

enum CellItemType {
  Padding,
  Date
}

function getMonthDays(year: number, month: number): number {
  if (year % 4 === 0) {
    return LEAP_MONTH_DAYS[month];
  } else {
    return NORMAL_MONTH_DAYS[month];
  }
}

function getMonthStartDay(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function joinClass(
  classList: Array<string | { name: string; enable: boolean }>
): string {
  return classList.reduce((finalClass, currentClass) => {
    if (typeof currentClass == "string") {
      return `${finalClass} ${currentClass}` as any;
    } else {
      return currentClass.enable
        ? `${finalClass} ${currentClass.name}`
        : finalClass;
    }
  }, "");
}

interface HeaderProps {
  month: number;
  year: number;
  nextMonth: () => void;
  preMonth: () => void;
  nextYear: () => void;
  preYear: () => void;
}

class Header extends React.PureComponent<HeaderProps, {}> {
  render() {
    const { year, month, nextMonth, preMonth, nextYear, preYear } = this.props;
    const monthDisplay = MONTH_DISPLAY[month];

    return (
      <div className="header">
        <a className="header-action pre-year" onClick={preYear} />
        <a className="header-action pre-month" onClick={preMonth} />
        <span className="header-selected">
          <span>{monthDisplay}</span>
          <span>{year}</span>
        </span>
        <a className="header-action next-month" onClick={nextMonth} />
        <a className="header-action next-year" onClick={nextYear} />
      </div>
    );
  }
}

interface DisplayItem {
  key: string;
  value: string;
  type: CellItemType;
}

interface DateContentProps {
  date: Date;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

class DateContent extends React.PureComponent<DateContentProps, {}> {
  selectDate = (e: React.MouseEvent<HTMLSpanElement>) => {
    const date = (e.target as any).dataset.date;
    this.props.onDateSelect(date);
  };

  render() {
    const { date, selectedDate } = this.props;
    const year = date.getFullYear(),
      month = date.getMonth();
    const paddingLen = getMonthStartDay(year, month);

    const displayList: DisplayItem[] = [];
    for (let i = 0; i < paddingLen; i++) {
      displayList.push({
        key: "padding" + i,
        value: "",
        type: CellItemType.Padding
      });
    }

    const monthLen = getMonthDays(year, month);
    for (let i = 1; i <= monthLen; i++) {
      displayList.push({
        key: "day" + i,
        value: "" + i,
        type: CellItemType.Date
      });
    }

    const rows: DisplayItem[][] = [];
    let row: DisplayItem[] = [];
    displayList.forEach((item, index) => {
      row.push(item);

      if ((index + 1) % 7 === 0) {
        rows.push(row);
        row = [];
      }
    });
    if (row.length > 0) {
      rows.push(row);
    }

    return (
      <div className="content-container">
        {rows.map((row, rowIndex) => (
          <div className="content-row" key={rowIndex}>
            {row.map(cell => (
              <div className="cell day-cell" key={cell.key}>
                <span
                  className={joinClass([
                    {
                      name: "content-day",
                      enable: cell.type === CellItemType.Date
                    },
                    {
                      name: "content-day-select",
                      enable:
                        cell.type === CellItemType.Date &&
                        cell.value === selectedDate
                    }
                  ])}
                  onClick={this.selectDate}
                  data-date={cell.value}
                >
                  {cell.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

interface SingleDateState {
  date: Date;
  selectedDate: string;
}

export class SingleDate extends React.PureComponent<{}, SingleDateState> {
  constructor(props) {
    super(props);

    const currentDate = new Date();
    this.state = {
      date: currentDate,
      selectedDate: currentDate.getDate().toString()
    };
  }

  onDateSelect = (selectedDate: string) => {
    this.setState({
      selectedDate
    });
  };

  setNewDate = (date: Date) => {
    this.setState({
      date: new Date(date),
      selectedDate: ""
    });
  };

  nextYear = () => {
    const { date } = this.state;

    date.setFullYear(date.getFullYear() + 1);
    this.setNewDate(date);
  };

  preYear = () => {
    const { date } = this.state;

    date.setFullYear(date.getFullYear() - 1);
    this.setNewDate(date);
  };

  nextMonth = () => {
    const { date } = this.state;

    const month = date.getMonth();
    if (month === 11) {
      date.setFullYear(date.getFullYear() + 1, 0);
    } else {
      date.setMonth(month + 1);
    }

    this.setNewDate(date);
  };

  preMonth = () => {
    const { date } = this.state;

    const month = date.getMonth();
    if (month === 0) {
      date.setFullYear(date.getFullYear() - 1, 11);
    } else {
      date.setMonth(month - 1);
    }

    this.setNewDate(date);
  };

  render() {
    const { date, selectedDate } = this.state;
    return (
      <div className="container">
        <Header
          month={date.getMonth()}
          year={date.getFullYear()}
          nextMonth={this.nextMonth}
          preMonth={this.preMonth}
          nextYear={this.nextYear}
          preYear={this.preYear}
        />

        <div className="week-content-container">
          <div className="weeks">
            {WEEKS.map(w => (
              <span key={w} className="cell">
                {w}
              </span>
            ))}
          </div>
          <DateContent
            date={date}
            onDateSelect={this.onDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    );
  }
}
