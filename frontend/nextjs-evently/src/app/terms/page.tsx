'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Section {
  title: string;
  content: React.ReactNode;
}

export default function TermsOfServicePage() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    userAgreement: false,
    ethicalPrinciples: false,
    legalCompliance: false,
    termsEnforcement: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections: Section[] = [
    {
      title: '1. User Agreement',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Upon registering at Evently, the users acknowledge that:
          </p>
          <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
            <li>They are institution-approved staff, instructors, or students.</li>
            <li>They will ethically and responsibly use the platform.</li>
            <li>They consent to uploading true information and not to fake being anyone.</li>
            <li>They consent that if these terms are violated, they could be suspended or have their account deleted.</li>
          </ul>
        </div>
      )
    },
    {
      title: '2. Ethical Principles',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Evently is dedicated to maintaining equality, inclusiveness, and openness. Users are called upon to conduct themselves based on the ethos of ethical behaviour, including:
          </p>
          <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
            <li><strong>Non-Discriminatory Content:</strong> Evently events to be hosted should never discriminate based on gender, race, religion, or any other part of protection by the law.</li>
            <li><strong>Community Standards Respecting:</strong> There shall be no harassment, hate speech, or any offensive matter allowed.</li>
            <li><strong>Academic Integrity:</strong> Users should not exploit the platform for academic dishonesty, like fake registrations or spam.</li>
            <li><strong>Transparency in Event Hosting:</strong> Organizers are required to present accurate, transparent information regarding their events, such as fees, timelines, and conditions.</li>
          </ul>
        </div>
      )
    },
    {
      title: '3. Legal Compliance & Terms of Use',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">3.1 Event Content Responsibility</h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
              <li>Event organizers are responsible for ensuring that event content complies with university regulations and laws.</li>
              <li>Evently is not liable for errors, cancellations, or changes to events.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">3.2 Intellectual Property</h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
              <li>All event content, such as descriptions and photographs, must be copyright compliant.</li>
              <li>Third-party content cannot be used without permission.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">3.3 Liability Limitations</h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
              <li>Evently is an events listing and management platform but is not responsible for the quality or success of any event.</li>
              <li>Evently has no responsibility for any losses, damages, or conflicts resulting from event attendance.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '4. Terms of Service Enforcement',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">4.1 Disobedience & Suspension of Account</h3>
            <p className="text-slate-600 dark:text-slate-400">Subscribers who disrespect these terms risk:</p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
              <li>Suspending of account, permanent or temporary.</li>
              <li>Reporting to university authorities for grievous violations.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">4.2 Changes in Terms</h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
              <li>Evently can periodically change these terms.</li>
              <li>Continuing use of the platform after upgrading is understood acceptance of changed terms.</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="border rounded-lg p-4">
              <button
                onClick={() => toggleSection(`section${index}`)}
                className="w-full flex justify-between items-center text-left text-xl font-semibold"
              >
                {section.title}
                {expandedSections[`section${index}`] ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </button>
              {expandedSections[`section${index}`] && (
                <div className="mt-4">{section.content}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}