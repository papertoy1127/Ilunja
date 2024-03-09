import { parseStringPromise } from 'xml2js';

interface LunPhResponse {
    response: {
        header: [{
            resultCode: number
        }],
        body: [{
                items: [{
                    item: [LunarPhaseData]
                }]
            }]
    };
};

interface LunarPhaseData {
    lunAge: [number];
    solDay: [number];
    solMonth: [number];
    solWeek: [string];
    solYear: [number];
}

export interface LunarPhase {
    lunAge: number;
    solDay: number;
    solMonth: number;
    solWeek: string | undefined;
    solYear: number;
}

const solWeekName = new Map<string, string>()
solWeekName.set("월", "Mon")
solWeekName.set("화", "Tue")
solWeekName.set("수", "Wed")
solWeekName.set("목", "Thu")
solWeekName.set("금", "Fri")
solWeekName.set("토", "Sat")
solWeekName.set("일", "Sun")

export async function LunPhInfo(year: number, month: number, day: number): Promise<LunarPhase> {
    const query: string = 'http://apis.data.go.kr/B090041/openapi/service/LunPhInfoService/getLunPhInfo' +
    `?serviceKey=${process.env.LUN_PH_INFO_KEY}&solYear=${year}&solMonth=${month.toString().padStart(2, '0')}&solDay=${day.toString().padStart(2, '0')}`;

    const response = await fetch(query);
    const text = await response.text();
    const data = await parseStringPromise(text) as LunPhResponse
    return {
        lunAge: data.response.body[0].items[0].item[0].lunAge[0],
        solDay: data.response.body[0].items[0].item[0].solDay[0],
        solMonth: data.response.body[0].items[0].item[0].solMonth[0],
        solWeek: solWeekName.get(data.response.body[0].items[0].item[0].solWeek[0]),
        solYear: data.response.body[0].items[0].item[0].solYear[0],
    }
}