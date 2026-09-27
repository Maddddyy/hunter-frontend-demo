'use client';

import AppShell from '@/components/AppShell';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-piloteer-void">
        <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
          <div>
            <div className="eyebrow mb-3">Configuration</div>
            <h1 className="text-4xl font-bold interp mb-4">Settings</h1>
            <p className="text-lg ctx max-w-3xl">
              Configure Hunter for your team and integrations
            </p>
          </div>

          {/* Profile */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
            <div className="card space-y-6">
              <div>
                <label className="block">
                  <span className="eyebrow mb-3 block">Name</span>
                  <input
                    type="text"
                    defaultValue="Sarah Mitchell"
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="eyebrow mb-3 block">Email</span>
                  <input
                    type="email"
                    defaultValue="sarah@piloteer.ai"
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="eyebrow mb-3 block">Role</span>
                  <select className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors">
                    <option>Account Executive</option>
                    <option>Sales Manager</option>
                    <option>Revenue Leader</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          {/* Integrations */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Integrations</h2>
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-piloteer-ink mb-1">Salesforce</h3>
                    <p className="text-sm ctx">CRM and deal data</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-piloteer-verified">Connected</span>
                    <button className="btn-ghost text-sm">Configure</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-piloteer-ink mb-1">Google Calendar</h3>
                    <p className="text-sm ctx">Meeting scheduling and prep</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-piloteer-verified">Connected</span>
                    <button className="btn-ghost text-sm">Configure</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-piloteer-ink mb-1">Zoom</h3>
                    <p className="text-sm ctx">Live call sensing</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-piloteer-verified">Connected</span>
                    <button className="btn-ghost text-sm">Configure</button>
                  </div>
                </div>
              </div>

              <div className="card opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-piloteer-ink mb-1">Microsoft Teams</h3>
                    <p className="text-sm ctx">Live call sensing</p>
                  </div>
                  <div>
                    <button className="btn-secondary text-sm">Connect</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-piloteer-ink mb-1">Needs You alerts</h3>
                  <p className="text-sm ctx">Get notified when Hunter surfaces priority actions</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-full h-full bg-piloteer-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-piloteer-verified"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-piloteer-hair">
                <div>
                  <h3 className="font-semibold text-piloteer-ink mb-1">Pattern discoveries</h3>
                  <p className="text-sm ctx">New validated patterns affecting your deals</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-full h-full bg-piloteer-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-piloteer-verified"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-piloteer-hair">
                <div>
                  <h3 className="font-semibold text-piloteer-ink mb-1">Momentum changes</h3>
                  <p className="text-sm ctx">Significant momentum shifts in your book</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-full h-full bg-piloteer-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-piloteer-verified"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="btn-primary">Save Changes</button>
            <button className="btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
