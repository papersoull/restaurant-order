export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-4xl rounded-[2rem] border border-cream bg-white p-10 shadow-cinnamon">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-beige">Welcome to Cinnamon Table</p>
          <h1 className="text-4xl font-semibold text-espresso-black sm:text-5xl">
            Order from your table with warm comfort.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-muted-beige">
            Scan the restaurant QR code or enter your table token in the browser to begin ordering. Your menu, cart, and tracking experience are styled for a cozy dining flow.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <div className="rounded-3xl bg-pastel-apricot px-5 py-4 text-sm font-semibold text-espresso-black shadow-cinnamon">
              Use <span className="font-bold">/menu/&lt;qrToken&gt;</span>
            </div>
            <div className="rounded-3xl bg-soft-milk px-5 py-4 text-sm font-semibold text-espresso-black border border-cream">
              Track orders at <span className="font-bold">/track/&lt;orderId&gt;</span>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-cream bg-soft-milk p-6 shadow-cinnamon">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Location</p>
              <h2 className="mt-3 text-xl font-semibold text-espresso-black">Cinnamon Table Bistro</h2>
              <p className="mt-2 text-sm leading-7 text-muted-beige">
                48 Rustic Lane, Maple Grove
                <br /> Open seating with table-side ordering.
              </p>
            </div>
            <div className="rounded-3xl border border-cream bg-soft-milk p-6 shadow-cinnamon">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Contact</p>
              <div className="mt-3 space-y-2 text-sm text-muted-beige">
                <p>Phone: (555) 019-4820</p>
                <p>Email: hello@cinnamontable.com</p>
                <p>Welcome drinks available for dine-in guests.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-cream bg-soft-milk p-6 shadow-cinnamon">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Hours</p>
              <div className="mt-3 space-y-2 text-sm text-muted-beige">
                <p>Mon - Fri: 11:00 AM - 10:00 PM</p>
                <p>Sat - Sun: 9:00 AM - 11:00 PM</p>
                <p className="text-cinnamon-brown font-semibold">Weekend brunch served 9-2.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-cream bg-soft-milk p-6 shadow-cinnamon">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Signature</p>
              <div className="mt-3 space-y-2 text-sm text-muted-beige">
                <p>Spiced Pumpkin Flatbread</p>
                <p>Slow-Braised Cinnamon Lamb</p>
                <p>Vanilla Cream Chai Panna Cotta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
