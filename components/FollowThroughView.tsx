'use client';

import { useState } from 'react';
import { Deal } from '@/lib/types/domain';
import { FollowPack, FollowRecord, useFollow } from '@/lib/followThrough';
import { interpret, signed } from '@/lib/momentum';
import { MomentumBar, MomentumFigure } from './MomentumVisuals';

export default function FollowThroughView({
  deal,
  pack,
  record,
  seller,
}: {
  deal: Deal;
  pack: FollowPack;
  record: FollowRecord;
  seller: boolean;
}) {
  const { setRead, setEmail, approve, confirmByHunter } = useFollow();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(record.readText);
  const [copied, setCopied] = useState(false);
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const label = record.status === 'seller-approved'
    ? 'Seller-approved'
    : record.status === 'hunter-confirmed'
      ? 'Hunter-confirmed'
      : `${record.hoursLeft}h left to review`;

  const copyEmail = async () => {
    const text = `To: ${pack.emailTo}\nSubject: ${pack.emailSubject}\n\n${record.emailBody}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="eyebrow">Hunter’s read</p>
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${record.status === 'open' ? 'border-piloteer-watch text-piloteer-watch' : 'border-piloteer-hair text-piloteer-metal'}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1"><MomentumBar value={deal.momentum} /></div>
        <MomentumFigure value={deal.momentum} size="sm" />
      </div>
      <p className="text-sm text-piloteer-metal">{interpret(deal.momentum, deal.history)} {signed(deal.momentum)}.</p>

      {editing ? (
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={6} className="w-full rounded-xl border border-piloteer-hair bg-piloteer-void px-3 py-2 text-sm outline-none focus:border-piloteer-focus" />
      ) : (
        <p className="text-sm leading-relaxed">{record.readText}</p>
      )}

      <ul className="space-y-2 text-sm text-piloteer-metal">
        {pack.roles.length > 0 && <li>Roles: {pack.roles.map((role) => `${role.name} · ${role.role}`).join(', ')}</li>}
        {pack.patterns.map((pattern) => <li key={pattern}>{pattern}</li>)}
        {pack.relationship.map((item) => <li key={item}>{item}</li>)}
      </ul>

      {seller && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => setEditing((value) => !value)}>{editing ? 'Close edit' : 'Edit'}</button>
          {editing && (
            <button type="button" className="btn-secondary" onClick={() => { setRead(deal.id, draft); setEditing(false); }}>Save edit</button>
          )}
          {record.status === 'open' && (
            <button type="button" className="btn-primary" onClick={() => approve(deal.id)}>Approve</button>
          )}
          {record.status === 'open' && (
            <button type="button" className="btn-ghost" onClick={() => confirmByHunter(deal.id)}>Let the 48 hours pass</button>
          )}
        </div>
      )}
      {!seller && <p className="text-sm text-piloteer-metal">The seller reviews this. Approving it is theirs.</p>}
      <p className="text-xs text-piloteer-mute">
        {record.status === 'open' && 'After 48 hours with no review, this becomes the active record and is labeled Hunter-confirmed, not Seller-approved. You can still edit it later.'}
        {record.status === 'seller-approved' && 'You approved this read. You can still edit it. Nothing was sent.'}
        {record.status === 'hunter-confirmed' && 'The review window closed. This is Hunter-confirmed, not Seller-approved. You can still edit it.'}
      </p>

      <div>
        <p className="eyebrow mb-2">Action items</p>
        <div className="space-y-2">
          {pack.actions.map((action) => (
            <label key={action.id} className="flex items-start gap-3 rounded-xl border border-piloteer-hair px-3 py-3 text-sm">
              <input type="checkbox" checked={Boolean(marked[action.id])} onChange={() => setMarked((current) => ({ ...current, [action.id]: !current[action.id] }))} className="mt-1" />
              <span>
                <span className="block font-semibold">{action.task}</span>
                <span className="mt-1 block text-piloteer-metal">{action.owner} · {action.when}{action.external ? ' · external' : ''}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-piloteer-mute">A check is your note. Hunter does not send the email, book the meeting, or update the CRM.</p>
      </div>

      <div>
        <p className="eyebrow mb-2">Draft follow-up</p>
        <p className="text-xs text-piloteer-mute">{pack.emailTo || 'No address on the deal'} · {pack.emailSubject}</p>
        <textarea value={record.emailBody} onChange={(event) => setEmail(deal.id, event.target.value)} rows={8} className="mt-2 w-full rounded-xl border border-piloteer-hair bg-piloteer-void px-3 py-2 text-sm outline-none focus:border-piloteer-focus" />
        <button type="button" className="btn-secondary mt-2" onClick={copyEmail}>{copied ? 'Copied' : 'Copy email'}</button>
        <p className="mt-2 text-xs text-piloteer-mute">Paste it into your email. Hunter does not send it, and does not claim it was sent.</p>
      </div>
    </div>
  );
}
