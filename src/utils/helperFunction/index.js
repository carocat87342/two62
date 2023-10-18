export const validFunc = (ctx, ...rest) => {
    const errors = [];
};

// sort func for sorting wrong value in object

export function isWrong(obj, nameList) {
    var data = {};
    nameList.forEach(item => {
        if (obj[item]) {
            data[item] = obj[item];
        }
    });
    return data;
}

export const cloneObject = obj => {
    return JSON.parse(JSON.stringify(obj));
};

export const numberToWord = num => {
    const a = [
            "",
            "one ",
            "two ",
            "three ",
            "four ",
            "five ",
            "six ",
            "seven ",
            "eight ",
            "nine ",
            "ten ",
            "eleven ",
            "twelve ",
            "thirteen ",
            "fourteen ",
            "fifteen ",
            "sixteen ",
            "seventeen ",
            "eighteen ",
            "nineteen ",
        ],
        b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    if ((num = num.toString()).length > 9) return "overflow";
    let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = "";
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore " : "";
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh " : "";
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand " : "";
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred " : "";
    str += n[5] != 0 ? (str != "" ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) : "";
    return str;
};
export const firstLetter = fullString => {
    const phrases = fullString.split(" ");
    const result = phrases.reduce((s, phrase) => {
        return `${s}${phrase.substr(0, 1).toUpperCase()}`;
    }, "");
    console.log(result);
    return result;
};
export const oppositeColor = rgba => {
    console.log(rgba);
    rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return rgba && rgba.length >= 4
        ? "#" +
              ("0" + (255 - parseInt(rgba[1], 10)).toString(16)).slice(-2) +
              ("0" + (255 - parseInt(rgba[2], 10)).toString(16)).slice(-2) +
              ("0" + (255 - parseInt(rgba[3], 10)).toString(16)).slice(-2)
        : "";
};
export const hexToRgbA = (hex, alpha = 1) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + `,${alpha})`;
    }
    throw new Error("Bad Hex");
};

export const makeid = length => {
    if (!length) length = 8;
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export default {
    numberToWord,
};
export const convertTimezoneName = timezoneAbbr => {
    const timezoneList = ["EST", "PST", "CST", "MST", "EDT", "HST"];
    const timezoneNameList = {
        EST: "America/New_York",
        PST: "America/Los_Angeles",
        CST: "America/Chicago",
        MST: "America/Denver",
        EDT: "America/New_York",
        HST: "US/Hawaii",
    };
    return timezoneNameList[timezoneAbbr];
};
