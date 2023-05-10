export function getStringElapsedTime(elapsedTime: number) {
    return new Date(elapsedTime).toISOString()
        .split("T")[1]
        .replace("Z", "")
        .split(".")[0];
}

export function prettyPrintTimestamp(timestamp: number) {
    const epoch = Math.ceil(timestamp/1000)*1000;
    return new Date(epoch).toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .split('.')[0].split(" ")[1]; 
}
