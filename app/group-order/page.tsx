import { Button } from "@/src/components/ui/button";

const whatsappNumber = "6288211573980";
const whatsappUrl = `https://wa.me/${whatsappNumber}`;

export default function GroupOrderPage() {
  return (
    <main className="min-h-screen w-full px-6 py-12">
      <section className="mx-auto w-full p-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h1 className="text-lg font-semibold uppercase tracking-[0.2em] text-foreground">
              Group Order
            </h1>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Group order is not available for now. Please contact our WhatsApp
              below for more information.
            </p>
            <Button asChild>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="uppercase"
              >
                Contact Whatsapp
              </a>
            </Button>
          </div>
          <div />
        </div>
      </section>
    </main>
  );
}
