export function formatDate(locale: string, dateStr: string) {
    try {
        // TODO: Adjust for server timezone to client timezone.
        const date = new Date(dateStr)
        return date.toLocaleString(locale, {} as Intl.DateTimeFormatOptions)
    } catch (error: any) {
        console.error(error)
        return dateStr
    }
}
