//file containing all the functions that are gonna be use over and over
import { TIMEOUT_SEC } from "./config.js";

const timeout = function(s){
    return new Promise(function(_, reject){
        setTimeout(function(){
            reject(new Error(`Request took too long! Timeout after ${s} seconds`));
        }, s * 1000);
    });
}

export const getJSon = async function(url){
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data;
    } catch (error) {
        throw error;
    }
}