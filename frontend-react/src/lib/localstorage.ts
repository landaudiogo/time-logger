export function getPersistedDays(): string[] {
    return Object.keys(localStorage).filter((key) => {
        if (key.match("[0-9]{2}/[0-9]{2}/[0-9]{2}")) {
            return key;
        }
    })
}
