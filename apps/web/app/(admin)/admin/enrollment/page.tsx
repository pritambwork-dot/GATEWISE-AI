export default function EnrollmentAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Guard Referrals & Enrollment Queue</h1>
      <p className="text-xs text-gatewise-secondary">
        Review unverified visitors escalated by guards for institutional identity registration.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Enrollment queue configured. Connects to <code>/api/v1/enrollment/referrals</code>.
      </div>
    </div>
  );
}
