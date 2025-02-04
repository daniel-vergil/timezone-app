// returns the current time in the specified locale.
export function getLocalTime(location: string): string {
  let options = {
      timeZone: location,
      hour: "numeric" as "numeric",
      minute: "numeric" as "numeric",
    },
    formatter = new Intl.DateTimeFormat([], options);

  return formatter.format(new Date());
}
