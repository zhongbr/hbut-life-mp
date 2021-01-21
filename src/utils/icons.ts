import '../static/icons/coupon.svg';
import '../static/icons/grades.svg';
import '../static/icons/exam.svg';
import '../static/icons/study.svg';
import '../static/icons/calculator.svg';
import '../static/icons/card.svg';
import '../static/icons/electric.svg';
import '../static/icons/elective.svg';
import '../static/icons/book.svg';
import '../static/icons/lab.svg';
import '../static/icons/calendar.svg';

interface Icon {
    name: string,
    iconFile: (base: string)=>string;
    backgroundColor: string;
    tag: string;
    navgate: (base: string)=>string;
    direction: 'vert'|'lvl';
    square: boolean;
}

export const gridWidth = 4;

export const Icons: Icon[] = [
    NewIcon('grades', 'grades.svg', '#F8A490', '成绩', 'vert', false),
    NewIcon('exam', 'exam.svg', '#C2AAE2', '考试', 'lvl', false),
    NewIcon('study', 'study.svg', '#A5D0FF', '自习', 'lvl', false),
    NewIcon('calculator', 'calculator.svg', '#E85A2E', '体测', 'vert' , false),
    NewIcon('card', 'card.svg', '#F5C39D', '校卡', 'vert', false),
    NewIcon('electric', 'electric.svg', '#2FD333', '电费', 'lvl', false),
    NewIcon('elective', 'elective.svg', '#CF97FC', '选修', 'vert', false),
    NewIcon('book', 'book.svg', '#D0E1DF', '图书', 'lvl', false),
    NewIcon('lab', 'lab.svg', '#F78E76', '实验', 'lvl', false),
    NewIcon('calendar', 'calendar.svg', '#EFA5CB', '校历', 'lvl', false)
]

function NewIcon(name: string, path: string, color: string, tag: string, direction: 'vert'|'lvl', square: boolean, nav?: string): Icon {
    return {
        name: name,
        iconFile: (base: string) => `${base}/${path}`,
        backgroundColor: color,
        tag: tag,
        navgate: (base?: string)=>nav?nav:`${base}/${name}`,
        square: square,
        direction: direction,
    }
}