export function getStringElapsedTime(elapsedTime: number) {
    return new Date(elapsedTime).toISOString()
        .split("T")[1]
        .replace("Z", "")
        .split(".")[0];
}

export function printTimeComponent(epoch: number, timezone?: string): string {
    epoch = Math.ceil(epoch/1000)*1000;
    const date = new Date(epoch);
    const options: Intl.DateTimeFormatOptions = {};
    if (timezone !== undefined) { 
        options["timeZone"] = timezone;
    }
    return date.toLocaleString("en-GB", options)
        .split(' ')[1];
}

export function printDateComponent(epoch: number, timezone?: string): string {
    epoch = Math.ceil(epoch/1000)*1000;
    const date = new Date(epoch);
    const options: Intl.DateTimeFormatOptions = {};
    if (timezone !== undefined) { 
        options["timeZone"] = timezone;
    }
    return date.toLocaleString("en-GB", options)
        .split(' ')[0].slice(0, -1);
}
