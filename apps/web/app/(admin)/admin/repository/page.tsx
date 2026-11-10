export default function RepositoryAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Google Drive Identity Repository</h1>
      <p className="text-xs text-gatewise-secondary">
        Direct synchronization with institutional Google Drive shared drives for approved portraits.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Drive sync manager configured. Connects to <code>/api/v1/identities/sync-drive</code>.
      </div>
    </div>
  );
}
