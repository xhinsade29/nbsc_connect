import { InquiryTool } from '@/components/inquiry/inquiry-tool';

export default function InquiryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Intelligent Inquiry Tool</h1>
        <p className="text-muted-foreground">
          Describe your issue, and we&apos;ll suggest the right department to contact.
        </p>
      </div>
      <InquiryTool />
    </div>
  );
}
