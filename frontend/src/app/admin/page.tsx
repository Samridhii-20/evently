'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { UserCheck, ShieldAlert, Users, Award, Building } from 'lucide-react';

type PendingOrganizer = {
  _id: string;
  name: string;
  email: string;
  organizingBody?: string;
  designation?: string;
};

export default function AdminPage() {
  const [pendingOrganizers, setPendingOrganizers] = useState<PendingOrganizer[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      setIsAdmin(false);
      setIsLoading(false);
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      setIsAdmin(true);
      fetchPendingOrganizers(token);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [router]);

  const fetchPendingOrganizers = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/admin/pending-organizers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setPendingOrganizers(data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.msg || 'Failed to fetch pending organizers',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while fetching pending organizers',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsProcessing(userId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/admin/approve-organizer/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Organizer approved successfully!',
        });
        // Remove approved organizer from the state list
        setPendingOrganizers(prev => prev.filter(org => org._id !== userId));
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.msg || 'Failed to approve organizer',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during approval',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-r-indigo-600 animate-spin"></div>
          <div className="text-xl font-medium text-slate-600 dark:text-slate-400">Loading admin console...</div>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto bg-red-100 dark:bg-red-950/50 p-4 rounded-full w-20 h-20 flex items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white">Access Denied</CardTitle>
            <CardDescription className="text-base text-slate-500 dark:text-slate-400">
              This area is strictly restricted to Administrators. If you believe this is an error, please contact the master administrator.
            </CardDescription>
          </CardHeader>
          <div className="p-6 pt-0 flex justify-center">
            <Button onClick={() => router.push('/')} size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md">
              Return to Homepage
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Approval Dashboard</h1>
            <p className="text-blue-100 text-lg">Manage, verify, and approve collegiate organizer accounts.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 self-start md:self-auto border border-white/10">
            <div className="bg-white/20 p-3 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingOrganizers.length}</div>
              <div className="text-xs text-blue-100 font-medium uppercase tracking-wider">Pending Accounts</div>
            </div>
          </div>
        </div>

        {/* Pending Organizers List */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <UserCheck className="h-5 w-5 text-blue-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              The following organizers have registered and are awaiting approval to host events.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {pendingOrganizers.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-1">All caught up!</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  There are no pending organizer approval requests at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingOrganizers.map((organizer) => (
                  <div key={organizer._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="space-y-4">
                      {/* Name & Email */}
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{organizer.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">{organizer.email}</p>
                      </div>

                      {/* Organizer info */}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                          <Building className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Body:</span>
                          <span>{organizer.organizingBody || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                          <Award className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Designation:</span>
                          <span>{organizer.designation || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleApprove(organizer._id)}
                      disabled={isProcessing === organizer._id}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
                    >
                      {isProcessing === organizer._id ? (
                        <>
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4" />
                          Approve Access
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
