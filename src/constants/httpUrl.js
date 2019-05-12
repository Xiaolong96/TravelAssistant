const IP = 'http://172.20.10.2:8080/travel-assistant/';

export default {
    LOGIN: IP + 'user/login.do',

    LOGOUT: IP + 'user/logout.do',

    LOGINWITHTOKEN: IP + 'user/login_with_token.do',

    UPDATE_INFORMATION: IP + 'user/update_information.do',

    GET_INFORMATION: IP + 'user/get_information.do',

    RESET_PASSWORD: IP + 'user/reset_password.do',
    
    // SCENE: 'http://route.showapi.com/1681-1',
    SCENE: 'http://localhost:8081/src/mock/scene.json',
    // WEATHER: 'https://www.tianqiapi.com/api/',
    WEATHER: 'http://localhost:8081/src/mock/weather.json',
    // COORDINATE: 'http://api.map.baidu.com/geocoder/v2/',
    COORDINATE: 'http://localhost:8081/src/mock/coordinate.json',
}