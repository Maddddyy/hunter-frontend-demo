'use client';

import LightDashboardLayout from '@/components/LightDashboardLayout';

export default function SettingsPage() {
  return (
    <LightDashboardLayout
      title="Settings"
      subtitle="Trust & Visibility and Model Updates"
    >
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Trust & Visibility */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trust & Visibility</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">Live guidance privacy</h3>
                <p className="text-sm text-gray-600">
                  Your live tips, scores, and moment-by-moment sensing history remain private. 
                  Managers see outcomes and patterns, never your real-time guidance.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">What leadership sees</h3>
                  <p className="text-sm text-gray-600">
                    Deal evidence, buyer commitments, momentum changes, and aggregated patterns. 
                    Your individual tip history stays with you.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">Recording consent</h3>
                  <p className="text-sm text-gray-600">
                    Hunter senses live calls with participant consent. Configure notification 
                    and disclosure preferences for your interactions.
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Model Updates */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Updates</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">New pattern detected</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Hunter sees buyers respond positively when you surface constraints early. 
                  Accept to add this to your coaching model.
                </p>
                <div className="text-xs text-gray-500">
                  Evidence: 8 interactions · 3 deals · validated
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Dismiss
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                  Accept
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Auto-accept validated patterns</h3>
                  <p className="text-sm text-gray-600">
                    Let Hunter automatically incorporate patterns with strong evidence
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Review history</h3>
                  <p className="text-sm text-gray-600">
                    View all accepted, dismissed, and pending model updates
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  View All
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LightDashboardLayout>
  );
}
