'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import { usePersona } from '@/lib/persona';

type SectionId = 'teach' | 'people' | 'trust' | 'calendar' | 'calls' | 'profile' | 'notifications';

type Teammate = {
  id: string;
  name: string;
  email: string;
  role: 'Sales rep' | 'Sales manager';
  status: 'Active' | 'Invited';
};

const starterTeam: Teammate[] = [
  { id: 'priya', name: 'Priya Shah', email: 'priya@piloteer.ai', role: 'Sales manager', status: 'Active' },
  { id: 'emma', name: 'Emma Dixon', email: 'emma@piloteer.ai', role: 'Sales rep', status: 'Active' },
  { id: 'noah', name: 'Noah Adler', email: 'noah@piloteer.ai', role: 'Sales rep', status: 'Active' },
];

export default function SettingsPage() {
  return (
    <DashboardNav>
      <SettingsBody />
    </DashboardNav>
  );
}

function SettingsBody() {
  const { persona } = usePersona();
  const isLeader = persona?.id === 'leader';
  const sections: { id: SectionId; label: string }[] = isLeader
    ? [
        { id: 'teach', label: 'Teach Hunter' },
        { id: 'people', label: 'People' },
        { id: 'trust', label: 'Trust' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'profile', label: 'Profile' },
        { id: 'notifications', label: 'Notifications' },
      ]
    : [
        { id: 'calendar', label: 'Calendar' },
        { id: 'calls', label: 'Calls' },
        { id: 'profile', label: 'Profile' },
        { id: 'notifications', label: 'Notifications' },
      ];

  const [section, setSection] = useState<SectionId>(isLeader ? 'teach' : 'calendar');
  const active = sections.some((item) => item.id === section) ? section : sections[0].id;

  if (!persona) return null;

  return (
    <div className="min-h-full bg-piloteer-void text-piloteer-ink px-4 py-8 sm:px-8">
      <p className="eyebrow">Settings · {persona.name}</p>
      <nav className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Settings sections">
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              active === item.id ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-metal'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 max-w-3xl">
        {active === 'teach' && <TeachSection />}
        {active === 'people' && <PeopleSection />}
        {active === 'trust' && <TrustSection />}
        {active === 'calendar' && <CalendarSection email={persona.email} />}
        {active === 'calls' && <CallsSection />}
        {active === 'profile' && <ProfileSection name={persona.name} email={persona.email} title={persona.title} />}
        {active === 'notifications' && <NotificationsSection leader={isLeader} />}
      </div>
    </div>
  );
}

function TeachSection() {
  return (
    <section>
      <div className="eyebrow mb-3">Company model</div>
      <h1 className="text-4xl font-bold interp">Teach Hunter</h1>
      <p className="mt-4 text-lg text-piloteer-metal max-w-2xl leading-relaxed">
        Hunter is trained on how Piloteer sells. Update products, buyers, pricing, and the sales motion whenever they change. Sales managers and sales reps do not see this section.
      </p>

      <div className="mt-10 card space-y-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold">Model approved</h2>
            <p className="mt-1 text-sm text-piloteer-metal">Hunter and Commander are in the company model. Sellers prepare against this.</p>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-piloteer-verified">Live</span>
        </div>
        <div className="grid grid-cols-1 gap-4 border-t border-piloteer-hair pt-2 sm:grid-cols-3">
          <Stat label="Products" value="Hunter, Commander" />
          <Stat label="Motion" value="On file" />
          <Stat label="Systems" value="Salesforce" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Link href="/settings/teach" className="btn-primary px-6 py-3">
          Update company model
        </Link>
        <p className="text-sm text-piloteer-mute">You can leave and come back. Nothing is locked after go-live.</p>
      </div>
    </section>
  );
}

function PeopleSection() {
  const [people, setPeople] = useState<Teammate[]>(starterTeam);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Teammate['role']>('Sales rep');
  const [notice, setNotice] = useState('');

  const invite = () => {
    if (!name.trim() || !email.trim()) {
      setNotice('Name and email are required.');
      return;
    }
    setPeople((current) => [
      { id: `invite-${Date.now()}`, name: name.trim(), email: email.trim(), role, status: 'Invited' },
      ...current,
    ]);
    setName('');
    setEmail('');
    setNotice(`${name.trim()} invited as ${role.toLowerCase()}.`);
  };

  return (
    <section>
      <div className="eyebrow mb-3">Team</div>
      <h1 className="text-4xl font-bold interp">People</h1>
      <p className="mt-4 text-lg text-piloteer-metal max-w-2xl leading-relaxed">
        Invite the people who will sell. Managers get team performance. Reps get their book and Hunter Console.
      </p>

      <form
        className="mt-10 card grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          invite();
        }}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="eyebrow mb-3 block">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="eyebrow mb-3 block">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none"
            />
          </label>
        </div>
        <label className="block max-w-xs">
          <span className="eyebrow mb-3 block">Role</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as Teammate['role'])}
            className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none"
          >
            <option>Sales rep</option>
            <option>Sales manager</option>
          </select>
        </label>
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary">Send invite</button>
          {notice && <p className="text-sm text-piloteer-metal">{notice}</p>}
        </div>
      </form>

      <ul className="mt-8">
        {people.map((person) => (
          <li key={person.id} className="flex items-center justify-between gap-6 border-t border-piloteer-hair py-5">
            <div>
              <div className="font-semibold">{person.name}</div>
              <div className="text-sm text-piloteer-metal">{person.email}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{person.role}</div>
              <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute mt-1">{person.status}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TrustSection() {
  return (
    <section>
      <div className="eyebrow mb-3">Visibility</div>
      <h1 className="text-4xl font-bold interp">Trust</h1>
      <p className="mt-4 text-lg text-piloteer-metal max-w-2xl leading-relaxed">
        Sellers start sensing themselves. Leaders see patterns, not a live feed of someone else’s call.
      </p>
      <ul className="mt-10 space-y-0">
        {[
          ['Seller', 'Starts, pauses, and stops sensing. Live guidance stays on their Console.'],
          ['Sales manager', 'Deal evidence, commitments, and team patterns. No moment-by-moment tips.'],
          ['Revenue leader', 'Company patterns, revenue friction, and what to change. Not individual tip history.'],
          ['Writeback', 'Follow-up and CRM drafts wait for the seller to approve.'],
        ].map(([title, body]) => (
          <li key={title} className="border-t border-piloteer-hair py-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-piloteer-metal leading-relaxed">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CalendarSection({ email }: { email: string }) {
  const [hideInternal, setHideInternal] = useState(true);
  const [respectPrivate, setRespectPrivate] = useState(true);

  return (
    <section>
      <div className="eyebrow mb-3">Google Calendar</div>
      <h1 className="text-4xl font-bold interp">Calendar sync</h1>
      <p className="mt-4 text-lg text-piloteer-metal max-w-2xl leading-relaxed">
        Hunter uses your calendar to prepare and start sensing. It suggests which meetings are sales calls. It does not claim to know every one.
      </p>

      <div className="mt-10 card">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold">Google Calendar</h2>
            <p className="mt-1 text-sm text-piloteer-metal">{email}</p>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-piloteer-verified">Connected</span>
        </div>
        <p className="mt-6 text-sm text-piloteer-metal leading-relaxed">
          Internal domain: piloteer.ai. Meetings with at least one external attendee are treated as likely customer calls.
        </p>
      </div>

      <div className="mt-4 card space-y-0">
        <Toggle
          title="Hide internal-only meetings"
          body="Standups and team meetings stay out of Start Sensing unless you ask to see them."
          checked={hideInternal}
          onChange={setHideInternal}
        />
        <div className="border-t border-piloteer-hair pt-4">
          <Toggle
            title="Respect private events"
            body="Private events stay busy blocks. Hunter does not read the title or the guest list."
            checked={respectPrivate}
            onChange={setRespectPrivate}
          />
        </div>
      </div>
    </section>
  );
}

function CallsSection() {
  const [teams, setTeams] = useState(false);
  return (
    <section>
      <div className="eyebrow mb-3">Sensing</div>
      <h1 className="text-4xl font-bold interp">Calls</h1>
      <p className="mt-4 text-lg text-piloteer-metal max-w-2xl leading-relaxed">
        Sensing starts when you start it from Console. Nothing listens in the background.
      </p>
      <div className="mt-10 space-y-4">
        <div className="card flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold">Zoom</h2>
            <p className="mt-1 text-sm text-piloteer-metal">Live guidance on calls you join</p>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-piloteer-verified">Connected</span>
        </div>
        <div className="card flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold">Microsoft Teams</h2>
            <p className="mt-1 text-sm text-piloteer-metal">{teams ? 'Connected. Sensing still starts from Console.' : 'Not connected'}</p>
          </div>
          <button type="button" onClick={() => setTeams(true)} className="btn-secondary text-sm">{teams ? 'Connected' : 'Connect'}</button>
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ name, email, title }: { name: string; email: string; title: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <section>
      <div className="eyebrow mb-3">Account</div>
      <h1 className="text-4xl font-bold interp">Profile</h1>
      <div className="mt-10 card space-y-6">
        <Field label="Name" value={name} />
        <Field label="Email" value={email} />
        <div>
          <span className="eyebrow mb-3 block">Role</span>
          <p className="text-piloteer-ink font-semibold">{title}</p>
          <p className="mt-2 text-sm text-piloteer-metal">
            Role comes from the invite. Switch the signed-in person from the menu at the bottom of the left navigation when you are walking the demo.
          </p>
        </div>
        <button type="button" onClick={() => setSaved(true)} className="btn-primary">{saved ? 'Saved' : 'Save profile'}</button>
      </div>
    </section>
  );
}

function NotificationsSection({ leader }: { leader: boolean }) {
  const [needsYou, setNeedsYou] = useState(true);
  const [patterns, setPatterns] = useState(true);
  const [momentum, setMomentum] = useState(false);

  return (
    <section>
      <div className="eyebrow mb-3">Alerts</div>
      <h1 className="text-4xl font-bold interp">Notifications</h1>
      <div className="mt-10 card space-y-0">
        <Toggle
          title={leader ? 'Company pattern alerts' : 'Needs you'}
          body={leader ? 'A systemic pattern that should change the motion, the message, or the product.' : 'Hunter has one next action with deal impact.'}
          checked={needsYou}
          onChange={setNeedsYou}
        />
        <div className="border-t border-piloteer-hair pt-4 mt-4">
          <Toggle
            title="Pattern discoveries"
            body="A pattern moved from early signal to supported evidence."
            checked={patterns}
            onChange={setPatterns}
          />
        </div>
        <div className="border-t border-piloteer-hair pt-4 mt-4">
          <Toggle
            title="Momentum changes"
            body="A book or a deal changed direction. Momentum is movement, not close probability."
            checked={momentum}
            onChange={setMomentum}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="eyebrow mb-3 block">{label}</span>
      <input
        defaultValue={value}
        className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none"
      />
    </label>
  );
}

function Toggle({
  title,
  body,
  checked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-piloteer-metal">{body}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full shrink-0 transition-colors ${checked ? 'bg-piloteer-verified' : 'bg-piloteer-surface-3'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
