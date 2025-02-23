window.onload = function () {

    // 初始化变量
    let weatherUpdateInterval;
    let amapKey = localStorage.getItem('amapKey') || '';
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

    // 时间更新函数
    function updateTime() {
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        document.getElementById('current-time').textContent = now.toLocaleTimeString('zh-CN', options);
        document.getElementById('date-info').textContent =
            `${now.toLocaleDateString('zh-CN', { weekday: 'long' })} · 
         ${now.toLocaleDateString('zh-CN')}`;
    }

    // 修改后的updateWeather函数
    async function updateWeather() {
        if (!amapKey) {
            showApiKeyWarning();
            return;
        }

        try {
            // 添加必要参数（示例使用北京adcode）
            const response = await fetch(`http://a.niube.top:8080/api/weather?key=${amapKey}&city=350604&extensions=base`);

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

    // 修改后的初始化部分
    setInterval(updateTime, 60000);
    updateTime();

    if (amapKey) {
        weatherUpdateInterval = setInterval(updateWeather, 60 * 60 * 1000);
        updateWeather();
    } else {
        showApiKeyWarning();
    }

}
