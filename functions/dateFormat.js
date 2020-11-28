export const dateFormat = date => {
        const newDate = new Date(date);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = newDate.getDate();
        const monthName = monthNames[newDate.getMonth()];
        let year = newDate.getFullYear().toString();
        year = year.substring(2, year.length);

        return `${day} ${monthName} '${year}`;
}
