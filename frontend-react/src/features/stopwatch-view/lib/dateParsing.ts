export function getStringElapsedTime(elapsedTime: number) {
    return new Date(elapsedTime).toISOString()
        .split("T")[1]
        .replace("Z", "")
        .split(".")[0];
}

export function prettyPrintTimestamp(timestamp: number) {
    return new Date(timestamp).toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .split('.')[0].split(" ")[1]; 
}
