import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, RefreshCcw, Star, BadgeCheck, PauseCircle, PlayCircle, Package, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminMarketplaceApi } from "../api/adminMarketplaceApi";

const money = (p) => p.price == null ? 'Price on request' : `${p.currency || 'KES'} ${Number(p.price).toLocaleString()}`;
const pill = (text) => <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700">{text || '—'}</span>;

export default function Marketplace() {
  const [data, setData] = useState({ results: [], stats: {}, count: 0, page_size: 20 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setData(await adminMarketplaceApi.list({ search, status, page })); }
    catch (e) { setError(e.message || 'Unable to load marketplace listings'); }
    finally { setLoading(false); }
  }, [search, status, page]);
  useEffect(() => { load(); }, [load]);

  async function act(item, action) {
    if ((action === 'pause' || action === 'activate') && !window.confirm(`Are you sure you want to ${action} this listing?`)) return;
    setBusy(item.id); setError('');
    try {
      const res = await adminMarketplaceApi.action(item.id, action);
      setSelected((old) => old?.id === item.id ? res.listing : old);
      await load();
    } catch (e) { setError(e.message || 'Action failed'); }
    finally { setBusy(null); }
  }

  const pages = Math.max(1, Math.ceil(data.count / (data.page_size || 20)));
  return <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Marketplace Management</h1><p className="text-sm text-slate-500">Manage listings across all IGATI organisations.</p></div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm"><RefreshCcw size={16}/> Refresh</button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Object.entries({ total: 'All listings', active: 'Active', draft: 'Draft', paused: 'Paused', featured: 'Featured', verified: 'Verified' }).map(([key, label]) =>
          <div key={key} className="rounded-2xl border bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{data.stats?.[key] ?? '—'}</p></div>
        )}
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input className="w-full rounded-xl border py-2.5 pl-10 pr-3 outline-none focus:border-blue-500" placeholder="Search product or organisation" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/></label>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-xl border bg-white px-3 py-2"><option value="">All statuses</option><option value="active">Active</option><option value="draft">Draft</option><option value="paused">Paused</option><option value="closed">Closed</option></select>
        </div>
        {error && <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {loading ? <p className="py-12 text-center text-slate-500">Loading listings…</p> : data.results.length === 0 ? <p className="py-12 text-center text-slate-500">No listings found.</p> :
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Product</th><th className="p-3">Organisation</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3">Flags</th><th className="p-3">Actions</th></tr></thead><tbody>
          {data.results.map(item => <tr key={item.id} className="border-b last:border-0"><td className="p-3"><div className="flex items-center gap-3">{item.image ? <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover"/> : <div className="rounded-lg bg-slate-100 p-3"><Package size={20}/></div>}<div><button className="font-semibold hover:text-blue-600" onClick={() => setSelected(item)}>{item.title}</button><p className="text-xs capitalize text-slate-500">{item.listing_type}</p></div></div></td><td className="p-3">{item.organisation?.name || 'Independent'}</td><td className="p-3 whitespace-nowrap">{money(item)}</td><td className="p-3">{pill(item.status)}</td><td className="p-3">{item.is_featured && <Star className="inline text-amber-500" size={17}/>} {item.is_verified && <BadgeCheck className="inline text-blue-600" size={17}/>}</td><td className="p-3"><div className="flex gap-2"><button disabled={busy === item.id} title={item.is_featured ? 'Unfeature' : 'Feature'} onClick={() => act(item, item.is_featured ? 'unfeature' : 'feature')} className="rounded-lg border p-2 disabled:opacity-50"><Star size={17}/></button><button disabled={busy === item.id} title={item.is_verified ? 'Remove verification' : 'Verify'} onClick={() => act(item, item.is_verified ? 'unverify' : 'verify')} className="rounded-lg border p-2 disabled:opacity-50"><BadgeCheck size={17}/></button><button disabled={busy === item.id} title={item.status === 'paused' ? 'Activate' : 'Pause'} onClick={() => act(item, item.status === 'paused' ? 'activate' : 'pause')} className="rounded-lg border p-2 disabled:opacity-50">{item.status === 'paused' ? <PlayCircle size={17}/> : <PauseCircle size={17}/>}</button></div></td></tr>)}
          </tbody></table></div>}
        <div className="mt-4 flex items-center justify-between text-sm"><span className="text-slate-500">{data.count} results · Page {page} of {pages}</span><div className="flex gap-2"><button className="rounded-lg border p-2 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={17}/></button><button className="rounded-lg border p-2 disabled:opacity-40" disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={17}/></button></div></div>
      </div>
    </div>
    {selected && <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelected(null)}><aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}><div className="mb-4 flex justify-between"><h2 className="text-xl font-bold">Listing details</h2><button onClick={() => setSelected(null)} aria-label="Close"><X/></button></div>{selected.image && <img src={selected.image} alt="" className="mb-4 h-48 w-full rounded-xl object-cover"/>}<h3 className="text-lg font-semibold">{selected.title}</h3><p className="mt-1 text-sm text-slate-500">{selected.organisation?.name || 'Independent'}</p><p className="mt-3 font-bold">{money(selected)}</p><p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{selected.description || 'No description'}</p><div className="mt-5 flex gap-2">{pill(selected.status)}{selected.is_verified && pill('Verified')}{selected.is_featured && pill('Featured')}</div><Link to={`/marketplace/${selected.slug}`} className="mt-6 inline-block text-sm font-semibold text-blue-600">View public listing</Link></aside></div>}
  </div>;
}