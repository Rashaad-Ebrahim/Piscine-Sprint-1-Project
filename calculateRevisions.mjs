export function calculateRevisions(startDate, topic) {
  const revisions = [];
  const intervals = [
    { days: 7 }, // 1 week from now
    { months: 1 }, // 1 month from now
    { months: 3 }, // 3 months from now
    { months: 6 }, // 6 months from now
    { years: 1 }, // 1 year from now
  ];

  intervals.forEach((interval) => {
    const revisionDate = new Date(startDate);
    if (interval.days) {
      revisionDate.setUTCDate(revisionDate.getUTCDate() + interval.days);
    } else if (interval.months) {
      revisionDate.setUTCMonth(revisionDate.getUTCMonth() + interval.months);
    } else if (interval.years) {
      revisionDate.setUTCFullYear(
        revisionDate.getUTCFullYear() + interval.years
      );
    }
    revisions.push({ topic, date: revisionDate.toISOString().split("T")[0] });
  });

  return revisions;
}
