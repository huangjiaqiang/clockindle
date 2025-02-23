// 初始化变量
var weatherUpdateInterval;

// 在script标签内添加天气Emoji映射
var weatherEmojiMap = {
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
function updateWeather() {
    var weatherStatusEl = document.getElementById('weather-status');
    weatherStatusEl.textContent = '正在获取天气...';

    var xhr = new XMLHttpRequest();
    var url = 'http://a.niube.top:8080/api/weather?city=350604&extensions=base';

    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.status !== '1') {
                throw new Error('天气数据获取失败: ' + data.info);
            }

            var liveData = data.lives[0];

            document.getElementById('weather-status').innerHTML =
                getWeatherEmoji(liveData.weather) + ' ' + liveData.weather;
            document.getElementById('temperature').textContent =
                liveData.temperature + '℃';
            document.getElementById('location').textContent =
                liveData.province + ' ' + liveData.city;
            document.getElementById('weather-update-time').textContent =
                formatTime(liveData.reporttime);
        } else {
            throw new Error('网络请求失败 (' + xhr.status + ')');
        }
    };

    xhr.onerror = function () {
        document.getElementById('weather-status').textContent = '获取失败: 网络错误';
        document.getElementById('temperature').textContent = '-';
        document.getElementById('location').textContent = '-';
        document.getElementById('weather-update-time').textContent = '-';
    };

    xhr.send();
}

// 新增Emoji获取函数
function getWeatherEmoji(weatherText) {
    // 处理特殊复合天气情况
    if (weatherText.indexOf('转') !== -1) {
        var weathers = weatherText.split('转');
        var result = [];
        for (var i = 0; i < weathers.length; i++) {
            var w = weathers[i].trim();
            result.push(weatherEmojiMap[w] || '❓');
        }
        return result.join('→');
    }

    // 精确匹配
    if (weatherEmojiMap[weatherText]) {
        return weatherEmojiMap[weatherText];
    }

    // 模糊匹配（包含关键词）
    var keywords = Object.keys(weatherEmojiMap);
    for (var j = 0; j < keywords.length; j++) {
        if (weatherText.indexOf(keywords[j]) !== -1) {
            return weatherEmojiMap[keywords[j]];
        }
    }

    return '❓';
}

// 新增时间格式化函数
function formatTime(timeString) {
    var date = new Date(timeString);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
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
    var calendar = {
        lunarInfo: [
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
            0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
            0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
            0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
            0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
            0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
            0x0d520
        ],
        lunarMonth: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
        lunarDay: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
            '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
            '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'],
        leapMonth: function (y) {
            return this.lunarInfo[y - 1900] & 0xf;
        },
        monthDays: function (y, m) {
            if (m > 12 || m < 1) return -1;
            return ((this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
        },
        lYearDays: function (y) {
            var i, sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1) sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
            return (sum + this.leapDays(y));
        },
        leapDays: function (y) {
            if (this.leapMonth(y)) return ((this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
            return 0;
        },
        toLunar: function (date) {
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                offset = 0,
                i, leap = 0, temp = 0;
            var baseDate = new Date(1900, 0, 31);
            var offset_days = Math.floor((date - baseDate) / 86400000);

            for (i = 1900; i < 2101 && offset_days > 0; i++) {
                temp = this.lYearDays(i);
                offset_days -= temp;
            }

            if (offset_days < 0) {
                offset_days += temp;
                i--;
            }

            var year_lunar = i;
            leap = this.leapMonth(i);
            var isLeap = false;

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

            var month_lunar = i;
            var day_lunar = offset_days + 1;

            return this.lunarMonth[month_lunar - 1] + '月' + this.lunarDay[day_lunar - 1];
        }
    };

    return calendar.toLunar(date);
}

// 修改updateTime函数
function updateTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var period = hours >= 12 ? '下午' : '上午';
    hours = hours % 12 || 12;
    var time = ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);

    document.getElementById('current-time').innerHTML =
        '<span class="period-indicator">' + period + '</span>' + time;

    var month = now.getMonth() + 1;
    var day = now.getDate();
    var dateStr = month + '月 ' + day + '日';
    var lunarDate = getLunarDate(now);

    document.getElementById('date-info').textContent =
        now.toLocaleDateString('zh-CN', { weekday: 'long' }) + ' · ' + dateStr + ' · ' + lunarDate;
}

// 修改后的初始化部分
setInterval(updateTime, 60000);
updateTime();

weatherUpdateInterval = setInterval(updateWeather, 60 * 60 * 1000);
updateWeather();