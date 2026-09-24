export function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function DashboardSkeleton() {
  return (
    <div className="page-block">
      <div className="topbar">
        <Skeleton style={{ width: 180, height: 34 }} />
      </div>
      <div className="stats-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="stat-card" key={i}>
            <Skeleton style={{ width: 64, height: 34, marginBottom: 10 }} />
            <Skeleton style={{ width: 110, height: 14 }} />
          </div>
        ))}
      </div>
      <div className="card">
        <Skeleton style={{ width: 140, height: 22, marginBottom: 16 }} />
        <div className="actions">
          <Skeleton style={{ width: 140, height: 36 }} />
          <Skeleton style={{ width: 140, height: 36 }} />
          <Skeleton style={{ width: 140, height: 36 }} />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 4, withImage = false }) {
  return (
    <div className="page-block">
      <div className="topbar">
        <Skeleton style={{ width: 200, height: 34 }} />
        <Skeleton style={{ width: 110, height: 42 }} />
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              {withImage ? <th><Skeleton style={{ width: 48, height: 12 }} /></th> : null}
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i}><Skeleton style={{ width: 70 + (i % 3) * 20, height: 12 }} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {withImage ? (
                  <td><Skeleton style={{ width: 64, height: 48, borderRadius: 4 }} /></td>
                ) : null}
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c}>
                    <Skeleton style={{ width: `${55 + ((r + c) % 4) * 10}%`, height: 14 }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="page-block">
      <div className="topbar">
        <Skeleton style={{ width: 180, height: 34 }} />
      </div>
      <div className="card form-grid">
        <div className="form-grid two">
          <div className="field">
            <Skeleton style={{ width: 100, height: 12, marginBottom: 8 }} />
            <Skeleton style={{ width: "100%", height: 44 }} />
          </div>
          <div className="field">
            <Skeleton style={{ width: 90, height: 12, marginBottom: 8 }} />
            <Skeleton style={{ width: "100%", height: 44 }} />
          </div>
        </div>
        <div className="field">
          <Skeleton style={{ width: 80, height: 12, marginBottom: 8 }} />
          <Skeleton style={{ width: "100%", height: 44 }} />
        </div>
        <div className="field">
          <Skeleton style={{ width: 80, height: 12, marginBottom: 8 }} />
          <Skeleton style={{ width: "100%", height: 90 }} />
        </div>
        <div className="form-grid two">
          <div className="field">
            <Skeleton style={{ width: 110, height: 12, marginBottom: 8 }} />
            <Skeleton style={{ width: "100%", height: 44 }} />
          </div>
          <div className="field">
            <Skeleton style={{ width: 110, height: 12, marginBottom: 8 }} />
            <Skeleton style={{ width: "100%", height: 44 }} />
          </div>
        </div>
        <Skeleton style={{ width: 140, height: 44 }} />
      </div>
    </div>
  );
}

export function LayoutSkeleton() {
  return (
    <div className="admin-shell">
      <header className="top-navbar">
        <Skeleton style={{ width: 160, height: 24 }} />
        <Skeleton style={{ width: 120, height: 20 }} />
      </header>
      <div className="admin-body">
        <aside className="sidebar">
          <div className="nav-list" style={{ padding: "1rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} style={{ width: "100%", height: 36, marginBottom: 8 }} />
            ))}
          </div>
        </aside>
        <main className="main">
          <DashboardSkeleton />
        </main>
      </div>
    </div>
  );
}
