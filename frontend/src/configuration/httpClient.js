import axios from 'axios'
import {CONFIG} from './configuration'

export const httpClient = axios.create({
    baseURL: CONFIG.API_GATEWAY,
    headers:{
        'Content-Type': 'application/json'
    }
})