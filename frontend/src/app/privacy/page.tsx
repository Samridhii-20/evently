'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We respect user privacy and collect only data needed to enhance the Evently experience. Our privacy commitments are:
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Collection</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Evently may collect:</p>
          <ul className="list-disc pl-6 mb-6 text-slate-600 dark:text-slate-400">
            <li>Authentication data (name, student email ID).</li>
            <li>Surveys and feedback to better service.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data Usage</h2>
          <ul className="list-disc pl-6 mb-6 text-slate-600 dark:text-slate-400">
            <li>Personal data will only be used for event management and notifications.</li>
            <li>User information shall never be given or released to third parties for sale by Evently.</li>
            <li>Anonymized and aggregated information can be utilized for analytics.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">We implement security practices, including:</p>
          <ul className="list-disc pl-6 mb-6 text-slate-600 dark:text-slate-400">
            <li>End-to-end encryption of sensitive information.</li>
            <li>Secure authentication processes to allow only authorized personnel to access information.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Rights</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Users have the right to:</p>
          <ul className="list-disc pl-6 mb-6 text-slate-600 dark:text-slate-400">
            <li>Access their information that is stored on Evently.</li>
            <li>Have their data corrected or deleted.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}