"use client";
import { useState } from "react";
import { X, Loader2, CheckCircle2, Upload } from "lucide-react";

export default function CheckoutModal({ product, onClose }) {
  const [step, setStep] = useState("form"); // form | processing | qris | manual | success
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [method, setMethod] = useState("QRIS_PAKASIR");
  const [order, setOrder] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStep("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: form.name,
          customer_email: form.email,
          customer_whatsapp: form.whatsapp,
          payment_method: method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      setOrder(data.order);
      setStep(method === "QRIS_PAKASIR" ? "qris" : "manual");
    } catch (err) {
      setError(err.message);
      setStep("form");
    }
  };

  const uploadProof = async () => {
    if (!proofFile) return setError("Please attach a payment screenshot.");
    setStep("processing");
    // In production: upload to storage (e.g. Cloudinary/S3) then send URL.
    // Here we mock it with a data URL placeholder note.
    const fakeUrl = `manual-proof-${order.id}-${proofFile.name}`;
    const res = await fetch("/api/checkout", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order.id, proof_of_payment_url: fakeUrl }),
    });
    if (res.ok) setStep("success");
    else {
      setError("Failed to submit proof.");
      setStep("manual");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-1">Checkout</h2>
        <p className="text-sm text-neutral-500 mb-4">{product.name} — Rp {product.price.toLocaleString("id-ID")}</p>

        {step === "form" && (
          <form onSubmit={submit} className="space-y-3">
            <Input label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Input label="WhatsApp Number" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="62812xxxxxxx" required />

            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {["QRIS_PAKASIR", "MANUAL"].map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      method === m
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  >
                    {m === "QRIS_PAKASIR" ? "QRIS (Auto)" : "Manual Transfer"}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium">
              Continue
            </button>
          </form>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="mt-3 text-sm text-neutral-500">Processing...</p>
          </div>
        )}

        {step === "qris" && order && (
          <div className="text-center space-y-3">
            <img src={order.qris_url} alt="QRIS Code" className="w-56 h-56 mx-auto border rounded-xl" />
            <p className="text-sm text-neutral-500">Scan with any e-wallet / mobile banking app.</p>
            <p className="text-xs text-neutral-400">Order ID: {order.id}</p>
            <p className="text-xs text-amber-600">Status will update automatically once paid.</p>
          </div>
        )}

        {step === "manual" && order && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm">
              Transfer Rp {product.price.toLocaleString("id-ID")} to:
              <br /><b>BCA 1234567890 a.n Difa Store</b>
            </div>
            <label className="flex items-center gap-2 border border-dashed rounded-lg p-4 cursor-pointer text-sm text-neutral-500">
              <Upload className="w-4 h-4" />
              {proofFile ? proofFile.name : "Upload payment screenshot"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setProofFile(e.target.files[0])} />
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={uploadProof} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium">
              Submit Proof
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="mt-3 font-medium">Order submitted!</p>
            <p className="text-sm text-neutral-500">We'll verify your payment and send the download link to your email/WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
