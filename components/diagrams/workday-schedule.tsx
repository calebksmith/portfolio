import { getMessages } from "@/lib/i18n/server";

import { Diagram } from "./diagram";

/**
 * One workday with V-minder, on the schedule a user set.
 *
 * The case study's point is that the schedule is the user's: moves arrive on
 * the hours they chose, they can push one back, and they can take one early.
 * So the drawing is a single day on a timeline with those three things on it,
 * using the values from the real schedule screen (weekdays, 9 to 5, every
 * hour) rather than anything from inside the app.
 *
 * Each move is a figure rather than a dot, standing or seated, because what
 * the timeline marks is someone getting up from a desk day to move. The
 * primary color marks the one move the user chose to take off schedule.
 */

const START = 60;
const HOUR = 80;
const LINE_Y = 128;
const x = (hours: number) => START + hours * HOUR;

type Pose = "standing" | "seated";

/**
 * A move, drawn as a figure in a 24-unit box: a standing stretch with both
 * arms up, or a seated reach from a chair. Strokes only, in `currentColor`.
 */
function Pictogram({ pose }: { pose: Pose }) {
  return pose === "standing" ? (
    <g>
      <circle cx="12" cy="4.5" r="2.2" />
      <path d="M12 7v7M12 9 7.5 4.5M12 9l4.5-4.5M12 14l-3.5 6.5M12 14l3.5 6.5" />
    </g>
  ) : (
    <g>
      <circle cx="10" cy="4.5" r="2.2" />
      <path d="M10 7v6.5M10 9l4.5-4.5M10 9.5l3 2.5M10 13.5h5.5v6.5M6.5 8.5v12M6.5 15H13M13 15v5.5" />
    </g>
  );
}

/**
 * A move on the timeline: a disc that masks the line, a hairline ring, and the
 * figure inside it. `x`/`y` is the center.
 */
function Move({
  cx,
  pose,
  tone = "text-foreground",
}: {
  cx: number;
  pose: Pose;
  tone?: string;
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={LINE_Y}
        r="18"
        stroke="currentColor"
        strokeWidth="1"
        className="fill-card text-input"
      />
      <g
        transform={`translate(${cx - 12.6} ${LINE_Y - 13}) scale(1.05)`}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={tone}
      >
        <Pictogram pose={pose} />
      </g>
    </g>
  );
}

/** A small figure beside a label, for the key. */
function KeyItem({
  at,
  pose,
  label,
}: {
  at: number;
  pose: Pose;
  label: string;
}) {
  return (
    <g>
      <g
        transform={`translate(${at} 190) scale(0.75)`}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
      >
        <Pictogram pose={pose} />
      </g>
      <text
        x={at + 24}
        y="204"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {label}
      </text>
    </g>
  );
}

export async function WorkdaySchedule() {
  const t = (await getMessages()).diagrams.workday;

  // Eight scheduled moves, one an hour from 9 AM, standing and seated in
  // turn. The 11 AM one is snoozed fifteen minutes.
  const scheduled: { hour: number; pose: Pose }[] = [
    { hour: 0, pose: "standing" },
    { hour: 1, pose: "seated" },
    { hour: 2.25, pose: "standing" },
    { hour: 3, pose: "seated" },
    { hour: 4, pose: "standing" },
    { hour: 5, pose: "seated" },
    { hour: 6, pose: "standing" },
    { hour: 7, pose: "seated" },
  ];
  const snoozedFrom = x(2);
  const snoozedTo = x(2.25);
  const offSchedule = x(5.5);

  return (
    <Diagram width={760} height={220} label={t.label}>
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
          y={LINE_Y + 32}
          textAnchor="middle"
          fontSize="11"
          className="fill-current text-muted-foreground"
        >
          {label}
        </text>
      ))}

      {/* Where the 11 AM move would have been, and where it went. */}
      <circle
        cx={snoozedFrom - 4}
        cy={LINE_Y}
        r="6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="2 2"
        className="fill-card text-muted-foreground"
      />
      <path
        d={`M${snoozedFrom - 2} ${LINE_Y - 8} Q ${snoozedFrom} ${LINE_Y - 32} ${snoozedTo - 8} ${LINE_Y - 20}`}
        stroke="currentColor"
        strokeWidth="1.25"
        markerEnd="url(#wd-arrow)"
        className="text-muted-foreground"
      />
      <text
        x={snoozedFrom}
        y={LINE_Y - 40}
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.snoozed}
      </text>

      {scheduled.map((move) => (
        <Move key={move.hour} cx={x(move.hour)} pose={move.pose} />
      ))}

      {/* One more, taken when the user was ready. */}
      <path
        d={`M${offSchedule} ${LINE_Y - 20} V ${LINE_Y - 34}`}
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground"
      />
      <text
        x={offSchedule}
        y={LINE_Y - 40}
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-foreground"
      >
        {t.offSchedule}
      </text>
      <Move cx={offSchedule} pose="standing" tone="text-primary" />

      <text
        x="24"
        y="204"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.total}
      </text>
      <KeyItem at={470} pose="standing" label={t.standing} />
      <KeyItem at={614} pose="seated" label={t.seated} />
    </Diagram>
  );
}
