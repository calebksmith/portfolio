import { getMessages } from "@/lib/i18n/server";

/**
 * One workday with V-minder, on the schedule a user set.
 *
 * The case study's point is that the schedule is the user's: moves arrive on
 * the hours they chose, they can push one back, and they can take one early.
 * So the drawing is a single day on a timeline with those three things on it,
 * using the values from the real schedule screen (weekdays, 9 to 5, every
 * hour) rather than anything from inside the app.
 *
 * `currentColor` for structure; the primary color marks the one move the user
 * chose to take off schedule.
 */

const START = 60;
const HOUR = 80;
const LINE_Y = 128;
const x = (hours: number) => START + hours * HOUR;

export async function WorkdaySchedule() {
  const t = (await getMessages()).diagrams.workday;

  // Eight scheduled moves, one an hour from 9 AM. The 11 AM one is snoozed.
  const scheduled = [0, 1, 3, 4, 5, 6, 7];
  const snoozedFrom = x(2);
  const snoozedTo = x(2.25);
  const offSchedule = x(5.5);

  return (
    <svg
      viewBox="0 0 760 220"
      role="img"
      aria-label={t.label}
      className="h-full w-full"
      fill="none"
    >
      <defs>
        <marker
          id="wd-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <text
        x="24"
        y="22"
        fontSize="11"
        letterSpacing="1.4"
        className="fill-current text-muted-foreground"
      >
        {t.title}
      </text>
      <text
        x="24"
        y="50"
        fontSize="13"
        className="fill-current text-foreground"
      >
        {t.setting}
      </text>

      {/* The day, 9 AM to 5 PM, with a tick on every hour. */}
      <path
        d={`M${x(0)} ${LINE_Y} H ${x(8)}`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-input"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${x(i)} ${LINE_Y - 6} V ${LINE_Y + 6}`}
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground"
        />
      ))}
      {t.hours.map((label, i) => (
        <text
          key={label}
          x={x(i * 2)}
          y={LINE_Y + 28}
          textAnchor="middle"
          fontSize="11"
          className="fill-current text-muted-foreground"
        >
          {label}
        </text>
      ))}

      {/* Scheduled moves. */}
      {scheduled.map((hour) => (
        <circle
          key={hour}
          cx={x(hour)}
          cy={LINE_Y}
          r="7"
          className="fill-current text-foreground"
        />
      ))}

      {/* The 11 AM move, pushed back fifteen minutes. */}
      <circle
        cx={snoozedFrom}
        cy={LINE_Y}
        r="7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="2 2"
        className="text-muted-foreground"
      />
      <path
        d={`M${snoozedFrom + 2} ${LINE_Y - 11} Q ${(snoozedFrom + snoozedTo) / 2} ${LINE_Y - 26} ${snoozedTo - 1} ${LINE_Y - 12}`}
        stroke="currentColor"
        strokeWidth="1.25"
        markerEnd="url(#wd-arrow)"
        className="text-muted-foreground"
      />
      <circle
        cx={snoozedTo}
        cy={LINE_Y}
        r="7"
        className="fill-current text-foreground"
      />
      <text
        x={(snoozedFrom + snoozedTo) / 2}
        y={LINE_Y - 36}
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.snoozed}
      </text>

      {/* One more, taken when the user was ready. */}
      <circle
        cx={offSchedule}
        cy={LINE_Y}
        r="7"
        className="fill-current text-primary"
      />
      <path
        d={`M${offSchedule} ${LINE_Y - 12} V ${LINE_Y - 30}`}
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground"
      />
      <text
        x={offSchedule}
        y={LINE_Y - 36}
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-foreground"
      >
        {t.offSchedule}
      </text>

      <text
        x="24"
        y="204"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.total}
      </text>
    </svg>
  );
}
