export const getFinancialYearPrefix = (date: Date) => {
    const monthIndex = date.getMonth();
    const fullYear = date.getFullYear();

    let startYear: number;
    let endYear: number;

    if (monthIndex >= 3) {
        startYear = fullYear;
        endYear = fullYear + 1;
    } else {
        startYear = fullYear - 1;
        endYear = fullYear;
    }

    // Format as "2627" (taking the last two digits of both years)
    const fyPrefix = `${String(startYear).slice(-2)}${String(endYear).slice(-2)}`;

    return fyPrefix;
};
