// 初始化变量
let weatherUpdateInterval;


// 在script标签内添加天气Emoji映射
const weatherEmojiMap = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '阵雨': '🌦️',
    '雷阵雨': '⛈️',
    '雨夹雪': '❄️🌧️',
    '小雨': '🌧️',
    '中雨': '🌧️',
    '大雨': '🌧️💦',
    '暴雨': '🌧️💦',
    '大雪': '❄️☃️',
    '中雪': '❄️',
    '小雪': '❄️',
    '雾': '🌫️',
    '沙尘暴': '🌪️',
    '浮尘': '💨',
    '霾': '😷'
};

// 修改后的updateWeather函数
async function updateWeather() {


    try {
        // 添加必要参数（示例使用北京adcode）
        const response = await fetch(`http://a.niube.top:8080/api/weather?city=350604&extensions=base`);

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        const data = await response.json();

        // 检查接口返回状态
        if (data.status !== '1') {
            throw new Error(`接口错误: ${data.info} (代码: ${data.infocode})`);
        }

        // 获取实时天气数据
        const liveData = data.lives[0];

        // 更新DOM元素
        document.getElementById('weather-status').textContent = liveData.weather;
        document.getElementById('temperature').textContent =
            `${liveData.temperature}℃`;
        document.getElementById('location').textContent =
            `${liveData.province} ${liveData.city}`;
        document.getElementById('weather-update-time').textContent =
            formatTime(liveData.reporttime);

        // 修改updateWeather函数中的天气显示部分
        document.getElementById('weather-status').innerHTML =
            `${getWeatherEmoji(liveData.weather)} ${liveData.weather}`;

    } catch (error) {
        console.error('天气更新失败:', error);
        document.getElementById('weather-status').textContent = '更新失败';
        document.getElementById('temperature').textContent = '-';
        document.getElementById('location').textContent = '-';
    }
}

// 新增Emoji获取函数
function getWeatherEmoji(weatherText) {
    // 处理特殊复合天气情况
    if (weatherText.includes('转')) {
        const weathers = weatherText.split('转');
        return weathers.map(w => weatherEmojiMap[w.trim()] || '❓').join('→');
    }

    // 精确匹配
    if (weatherEmojiMap[weatherText]) {
        return weatherEmojiMap[weatherText];
    }

    // 模糊匹配（包含关键词）
    const keywords = Object.keys(weatherEmojiMap);
    const matchedKey = keywords.find(key => weatherText.includes(key));
    return matchedKey ? weatherEmojiMap[matchedKey] : '❓';
}

// 新增时间格式化函数
function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 新增API Key缺失提示
function showApiKeyWarning() {
    document.getElementById('weather-status').textContent = '请先配置API Key';
    document.getElementById('temperature').textContent = '-';
    document.getElementById('location').textContent = '-';
    document.getElementById('weather-update-time').textContent = '-';
}

// 添加农历转换函数
function getLunarDate(date) {
    const calendar = {
        /**
         * 农历1900-2100的润大小信息表
         * @Array Of Property
         * @return Hex
         */
        lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
            0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
            0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
            0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
            0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
            0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
            0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
            0x0d520],
        
        /**
         * 农历月份名称
         */
        lunarMonth: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
        
        /**
         * 农历日期名称
         */
        lunarDay: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
            '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
            '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'],

        /**
         * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
         * @param y lunar Year
         * @return Number (0-12)
         */
        leapMonth: function (y) {
            return this.lunarInfo[y - 1900] & 0xf;
        },

        /**
         * 返回农历y年m月的总天数
         * @param y lunar Year
         * @param m lunar Month
         * @return Number (-1、29、30)
         */
        monthDays: function (y, m) {
            if (m > 12 || m < 1) return -1;
            return ((this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
        },

        /**
         * 返回农历y年的总天数
         * @param y lunar Year
         * @return Number
         */
        lYearDays: function (y) {
            let i, sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1) sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
            return (sum + this.leapDays(y));
        },

        /**
         * 返回农历y年闰月的天数
         * @param y lunar Year
         * @return Number (0、29、30)
         */
        leapDays: function (y) {
            if (this.leapMonth(y)) return ((this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
            return 0;
        },

        /**
         * 返回农历日期字符串
         * @param date Date对象
         * @return String
         */
        toLunar: function (date) {
            let year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                offset = 0,
                i, leap = 0, temp = 0;
            let baseDate = new Date(1900, 0, 31);
            let offset_days = Math.floor((date - baseDate) / 86400000);

            for (i = 1900; i < 2101 && offset_days > 0; i++) {
                temp = this.lYearDays(i);
                offset_days -= temp;
            }

            if (offset_days < 0) {
                offset_days += temp;
                i--;
            }

            let year_lunar = i;
            leap = this.leapMonth(i);
            let isLeap = false;

            for (i = 1; i < 13 && offset_days > 0; i++) {
                if (leap > 0 && i === (leap + 1) && isLeap === false) {
                    --i;
                    isLeap = true;
                    temp = this.leapDays(year_lunar);
                } else {
                    temp = this.monthDays(year_lunar, i);
                }

                if (isLeap === true && i === (leap + 1)) isLeap = false;
                offset_days -= temp;
            }

            if (offset_days === 0 && leap > 0 && i === leap + 1) {
                if (isLeap) {
                    isLeap = false;
                } else {
                    isLeap = true;
                    --i;
                }
            }

            if (offset_days < 0) {
                offset_days += temp;
                --i;
            }

            let month_lunar = i;
            let day_lunar = offset_days + 1;

            return `${this.lunarMonth[month_lunar - 1]}月${this.lunarDay[day_lunar - 1]}`;
        }
    };

    return calendar.toLunar(date);
}

// 修改updateTime函数
function updateTime() {
    const now = new Date();
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const time = now.toLocaleTimeString('zh-CN', timeOptions).replace(/上午|下午/g, '');
    const isPM = now.getHours() >= 12;
    const periodText = isPM ? '下午' : '上午';
    
    document.getElementById('current-time').innerHTML = 
        `<span class="period-indicator">${periodText}</span>${time}`;
    
    const dateOptions = { month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('zh-CN', dateOptions).replace('月', '月 ');
    const lunarDate = getLunarDate(now);
    
    document.getElementById('date-info').textContent = 
        `${now.toLocaleDateString('zh-CN', { weekday: 'long' })} · ${dateStr} · ${lunarDate}`;
}

window.onload = function () {
    // 时间更新函数
    function updateTime() {
        const now = new Date();
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        const time = now.toLocaleTimeString('zh-CN', timeOptions).replace(/上午|下午/g, '');
        const isPM = now.getHours() >= 12;
        const periodText = isPM ? '下午' : '上午';
        
        document.getElementById('current-time').innerHTML = 
            `<span class="period-indicator">${periodText}</span>${time}`;
        const dateOptions = { month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('zh-CN', dateOptions).replace('月', '月 ');
        const lunarDate = getLunarDate(now);
        document.getElementById('date-info').textContent = 
            `${now.toLocaleDateString('zh-CN', { weekday: 'long' })} · ${dateStr} · ${lunarDate}`;
    }

    // 修改后的初始化部分
    setInterval(updateTime, 60000);
    updateTime();

    weatherUpdateInterval = setInterval(updateWeather, 60 * 60 * 1000);
        updateWeather();
}
