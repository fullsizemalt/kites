import { PasteForm } from "@/components/paste-form";

export default function NewPastePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Paste</h1>
            <PasteForm />
        </div>
    );
}
