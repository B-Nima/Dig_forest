// Данные по Закаменскому лесничеству из журнала ЛПО 2023

export interface ForestAct {
  id: number;
  actNumber: number;
  subLesnichestvo: string;
  quarter: number;
  stand: string;
  area: number;
  method: 'ДЗЗ' | 'Визуальный';
  damageCause: string;
  damageCode?: string;
  status: 'Прошёл' | 'На оспаривании';
}

export const forestActs: ForestAct[] = [
  {
    id: 250,
    actNumber: 250,
    subLesnichestvo: 'Михайловское',
    quarter: 8,
    stand: '2',
    area: 581,
    method: 'ДЗЗ',
    damageCause: 'Лесоустройство 2004 г., лесной пожар (2004)',
    damageCode: '848',
    status: 'На оспаривании',
  },
  {
    id: 251,
    actNumber: 251,
    subLesnichestvo: 'Цаган-Моринское',
    quarter: 73,
    stand: '1',
    area: 756,
    method: 'ДЗЗ',
    damageCause: 'Лесоустройство 2004 г., лесной пожар (2004)',
    damageCode: '848',
    status: 'На оспаривании',
  },
  {
    id: 326,
    actNumber: 326,
    subLesnichestvo: 'Михайловское',
    quarter: 41,
    stand: '19',
    area: 25,
    method: 'Визуальный',
    damageCause: 'Межвидовая конкуренция',
    damageCode: '610',
    status: 'Прошёл',
  },
  {
    id: 327,
    actNumber: 327,
    subLesnichestvo: 'Михайловское',
    quarter: 318,
    stand: '11(2)',
    area: 7.6,
    method: 'Визуальный',
    damageCause: '—',
    status: 'Прошёл',
  },
  {
    id: 328,
    actNumber: 328,
    subLesnichestvo: 'Михайловское',
    quarter: 226,
    stand: '12(2)',
    area: 2.3,
    method: 'Визуальный',
    damageCause: '—',
    status: 'Прошёл',
  },
  {
    id: 329,
    actNumber: 329,
    subLesnichestvo: 'Баянгольское дача 1',
    quarter: 514,
    stand: '10',
    area: 1633,
    method: 'ДЗЗ',
    damageCause: 'Лесоустройство 2004 г., лесной пожар (2004)',
    damageCode: '848',
    status: 'Прошёл',
  },
  {
    id: 330,
    actNumber: 330,
    subLesnichestvo: 'Баянгольское дача 1',
    quarter: 408,
    stand: '6',
    area: 3469,
    method: 'ДЗЗ',
    damageCause: 'Лесоустройство 2004 г., лесной пожар',
    damageCode: '857',
    status: 'Прошёл',
  },
];

// KPI расчёты
export const totalArea = forestActs.reduce((sum, a) => sum + a.area, 0);
export const dzzArea = forestActs.filter(a => a.method === 'ДЗЗ').reduce((sum, a) => sum + a.area, 0);
export const visualArea = forestActs.filter(a => a.method === 'Визуальный').reduce((sum, a) => sum + a.area, 0);
export const dzzShare = (dzzArea / totalArea) * 100;
export const approvedInTime = forestActs.filter(a => a.status === 'Прошёл').length;
export const approvedShare = (approvedInTime / forestActs.length) * 100;
export const disputedCount = forestActs.filter(a => a.status === 'На оспаривании').length;
export const disputedShare = (disputedCount / forestActs.length) * 100;

// Нормативные документы
export interface NormDoc {
  id: string;
  title: string;
  regulation: string;
  requirement: string;
}

export const normDocs: NormDoc[] = [
  {
    id: '156',
    title: 'Приказ Минприроды России от 05.04.2017 № 156',
    regulation: 'Порядок осуществления государственного лесопатологического мониторинга',
    requirement: 'Обязательные показатели санитарного состояния, категории состояния деревьев, сроки наблюдений',
  },
  {
    id: '706',
    title: 'Приказ Рослесхоза от 31.05.2023 № 706',
    regulation: 'Порядок ведения реестров ГЛПМ',
    requirement: 'Требования к внесению, актуализации и исключению участков из реестров (УПП, МЗЛ)',
  },
  {
    id: '236',
    title: 'Приказ ФБУ «Рослесозащита» от 08.09.2023 № 236-р',
    regulation: 'Регламент ведения реестров ГЛПМ',
    requirement: 'Регламентированные сроки актуализации данных, форма заявки',
  },
  {
    id: '97',
    title: 'Приказ Минприроды России от 24.02.2026 № 97',
    regulation: 'Порядок проведения лесопатологических обследований и формы акта ЛПО',
    requirement: 'Форма акта ЛПО, обязательные поля для цифрового двойника',
  },
  {
    id: '2047',
    title: 'Постановление Правительства РФ от 09.12.2020 № 2047',
    regulation: 'Правила санитарной безопасности в лесах',
    requirement: 'Состав мероприятий: ГЛПМ, ЛПО, предупреждение распространения вредных организмов',
  },
];

// Нормативно значимые показатели
export interface NormIndicator {
  indicator: string;
  source: string;
  display: string;
}

export const normIndicators: NormIndicator[] = [
  {
    indicator: 'Площадь повреждённых насаждений, га',
    source: 'Приказ № 156, реестры УПП',
    display: 'KPI-карточка: 6 473,9 га (в т.ч. 6 439 га — ДЗЗ)',
  },
  {
    indicator: 'Доля актов, утверждённых в срок',
    source: 'Приказ № 706, Регламент № 236-р',
    display: 'KPI «Доля в срок» = 5 из 7 (71,4%)',
  },
  {
    indicator: 'Число актов на оспаривании',
    source: 'Правила санитарной безопасности',
    display: 'KPI: 2 из 7 (28,6%) — на оспаривании',
  },
  {
    indicator: 'Распределение по причинам повреждений',
    source: 'Форма акта ЛПО (Приказ № 97)',
    display: 'Топ причин: лесной пожар 2004 г. (4 акта), межвидовая конкуренция (1), без причины (2)',
  },
  {
    indicator: 'Площадь обследования по способам ЛПО',
    source: 'Приказ № 156 (периодичность)',
    display: 'Столбчатая диаграмма: ДЗЗ — 6 439 га, визуальный — 34,9 га',
  },
  {
    indicator: 'Привязка к кварталам/выделам',
    source: 'Форма акта ЛПО',
    display: 'Карта: кварталы 8, 41, 73, 226, 318, 408, 514',
  },
];
