import env from './env'

const DEV_URL = 'http://localhost:8088/';
const PRO_URL = 'https://wzsjlw.com';
export default env === 'development' ? DEV_URL : PRO_URL
