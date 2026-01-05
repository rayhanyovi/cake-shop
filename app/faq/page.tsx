import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

const faqs = [
  {
    id: "item-1",
    question: "What is your delivery schedule?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "item-2",
    question: "How far in advance should I place an order?",
    answer:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "item-3",
    question: "Can I customize cake wording and greeting cards?",
    answer:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "item-4",
    question: "What payment methods do you accept?",
    answer:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen w-full px-6 py-12">
      <section className="mx-auto w-full p-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-foreground">
              Frequently Asked Questions
            </h1>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground col-span-2 xl:col-span-1">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div />
        </div>
      </section>
    </main>
  );
}
