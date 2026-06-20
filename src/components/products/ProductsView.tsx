// ProductsView
import React, { useState, useEffect } from "react";
import { cx, flowUid } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon, ConfirmModal, PageHead } from "../ui";
import { useDataset } from "../../lib/dataset";
import { ProductCard } from "./ProductCard";
import { ProductEditorModal } from "./ProductEditorModal";

export function ProductsView({ t, prefill }: any) {
  const { PRODUCTS } = useDataset();
  const p = t.prod;
  const [products, setProducts] = useState<any[]>(() => (prefill && prefill.id) ? [prefill, ...PRODUCTS] : PRODUCTS);
  useEffect(() => { if (prefill && prefill.id) setProducts((list) => list.some((x) => x.id === prefill.id) ? list : [prefill, ...list]); }, [prefill]);
  const [editing, setEditing] = useState<any>(null);
  const [del, setDel] = useState<any>(null);
  const [catTab, setCatTab] = useState("all");
  const catOf = (x: any) => (x.cat && x.cat.trim()) ? x.cat.trim() : "";
  const cats: string[] = [];
  products.forEach((x) => { const c = catOf(x); if (!cats.includes(c)) cats.push(c); });
  const save = (prod: any) => {
    if (prod.id) setProducts((list) => list.map((x) => x.id === prod.id ? prod : x));
    else setProducts((list) => [{ ...prod, id: flowUid() }, ...list]);
    setEditing(null); toast(prod.id ? t.toast.applied : t.toast.created);
  };
  return (
    <>
      <PageHead title={p.title} sub={p.sub}><button className="db-btn db-btn-mint" onClick={() => setEditing({ id: null, name: "", cat: "", desc: "", doc: "", active: true, plans: [], discounts: [] })}><Icon name="plus" size={16} /> {p.newBtn}</button></PageHead>
      <div className="db-ovtabs" role="tablist">
        <button role="tab" aria-selected={catTab === "all"} className={cx(catTab === "all" && "on")} onClick={() => setCatTab("all")}><span>{p.allCat}</span></button>
        {cats.map((c) => <button key={c} role="tab" aria-selected={catTab === c} className={cx(catTab === c && "on")} onClick={() => setCatTab(c)}><span>{c ? (p.cats[c] || c) : p.uncat}</span></button>)}
      </div>
      {cats.filter((cat) => catTab === "all" || cat === catTab).map((cat) => {
        const items = products.filter((x) => catOf(x) === cat);
        return (
          <section key={cat} className="db-prodcat">
            <div className="db-prodcat-head"><span>{cat ? (p.cats[cat] || cat) : p.uncat}</span><span className="db-muted" style={{ fontWeight: 600 }}>{items.length} {p.products}</span></div>
            <div className="db-grid g-3">{items.map((prod) => <ProductCard key={prod.id} prod={prod} t={t} onEdit={() => setEditing(prod)} onDelete={() => setDel(prod)} />)}</div>
          </section>
        );
      })}
      {editing && <ProductEditorModal t={t} init={editing} onClose={() => setEditing(null)} onSave={save} />}
      {del && <ConfirmModal title={p.delT} body={del.name} confirmLabel={t.drawer.del} cancelLabel={p.cancel} danger onConfirm={() => { setProducts((list) => list.filter((x) => x !== del)); setDel(null); toast(t.toast.deleted); }} onClose={() => setDel(null)} />}
    </>
  );
}
