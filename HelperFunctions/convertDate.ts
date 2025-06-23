
export function formateDate(date: Date | undefined) {
    const rawDate = new Date(date!);

    const month = String(rawDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(rawDate.getDate()).padStart(2, '0');
    const year = rawDate.getFullYear();

    return `${month}/${day}/${year}`;
}