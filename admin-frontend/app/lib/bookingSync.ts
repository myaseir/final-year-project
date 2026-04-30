// This runs purely on the Next.js server. It fetches your Booking.com iCal.
export async function getBookedDates(): Promise<Date[]> {
  // Replace this with your actual Booking.com Export iCal link
  const ICAL_URL = "https://admin.booking.com/hotel/hoteladmin/ical.html?id=YOUR_LINK";
  
  try {
    // Revalidate every 3600 seconds (1 hour) so your site doesn't spam Booking.com
    const response = await fetch(ICAL_URL, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Failed to fetch calendar");

    const icalData = await response.text();
    const bookedDates: Date[] = [];

    // Simple parser to extract DTSTART and DTEND from the .ics file
    const lines = icalData.split('\n');
    let currentStart: Date | null = null;
    let currentEnd: Date | null = null;

    for (const line of lines) {
      if (line.startsWith('DTSTART')) {
        const dateStr = line.split(':')[1].trim();
        currentStart = new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
      } else if (line.startsWith('DTEND')) {
        const dateStr = line.split(':')[1].trim();
        currentEnd = new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
        
        // Push all dates between start and end into our booked array
        if (currentStart && currentEnd) {
          let dt = new Date(currentStart);
          while (dt < currentEnd) {
            bookedDates.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
          }
        }
      }
    }
    return bookedDates;
  } catch (error) {
    console.error("Calendar sync error:", error);
    return []; // Fail gracefully, assume available if sync fails
  }
}