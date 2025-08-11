'use client';

import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DemoModeBanner() {
  return (
    <Alert className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Demo Mode Only</span>
          <span>•</span>
          <span>This is a demonstration application with simulated data for educational purposes.</span>
        </div>
        <div className="text-sm mt-1 text-amber-700 dark:text-amber-300">
          No real transactions or funds are used. All prices, pools, and swap data are simulated.
        </div>
      </AlertDescription>
    </Alert>
  );
}

export function DemoModeBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">
      <AlertTriangle className="h-3 w-3" />
      Demo Mode
    </div>
  );
}

export function DemoModeFooter() {
  return (
    <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <div className="font-semibold mb-1">Demo Application Notice</div>
          <div className="space-y-1">
            <p>• This is a demonstration version of Social Swap Pool</p>
            <p>• All blockchain interactions are simulated</p>
            <p>• No real cryptocurrency transactions are executed</p>
            <p>• Data is generated for demonstration purposes only</p>
            <p>• Do not use this application with real funds</p>
          </div>
        </div>
      </div>
    </div>
  );
}