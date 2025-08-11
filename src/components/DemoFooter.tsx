'use client';

import { AlertTriangle, Shield, Info } from 'lucide-react';

export function DemoFooter() {
  return (
    <footer className="mt-16 border-t border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Demo Warning */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">Demo Mode Active</h3>
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
              <p>This is a demonstration version of Social Swap Pool.</p>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                ⚠️ No real funds or transactions are used.
              </p>
            </div>
          </div>

          {/* What's Simulated */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Simulated Features</h3>
            </div>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Token prices and market data</li>
              <li>• DEX integration and quotes</li>
              <li>• Pool balances and transactions</li>
              <li>• Gas fees and estimates</li>
              <li>• Wallet connections (test mode)</li>
            </ul>
          </div>

          {/* Educational Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800 dark:text-green-200">Educational Purpose</h3>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
              <p>This demo showcases the functionality of a decentralized social swapping platform.</p>
              <p>Perfect for learning about DeFi, multisig wallets, and collective trading without financial risk.</p>
            </div>
          </div>
        </div>

        {/* Bottom Warning */}
        <div className="mt-8 pt-6 border-t border-amber-200 dark:border-amber-800">
          <div className="text-center">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase tracking-wide">
              🔒 For Demonstration Only - Not Financial Advice
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              Always do your own research and never invest more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}