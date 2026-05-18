import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useReducer, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { saveSurvey, currentUser } from "../lib/auth";

export const Route = createFileRoute("/survey")({
  component: SurveyPage,
});

interface SurveyForm {
  name: string;
  gender: string;
  aadhaar: string;
  social: string;
  mobile: string;
  category: string;
  q1: string;
  q2: string;
  feedback: string;
}

type FieldAction = { field: keyof SurveyForm; value: string };

const INITIAL_FORM: SurveyForm = {
  name: "",
  gender: "Male",
  aadhaar: "",
  social: "",
  mobile: "",
  category: "",
  q1: "",
  q2: "",
  feedback: "",
};

function reducer(state: SurveyForm, action: FieldAction): SurveyForm {
  return { ...state, [action.field]: action.value };
}

function SurveyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useReducer((_: number, next: number) => next, 1);
  const [form, dispatch] = useReducer(reducer, INITIAL_FORM);

  useEffect(() => {
    if (!currentUser()) navigate({ to: "/login" });
  }, [navigate]);

  const set = useCallback((field: keyof SurveyForm, value: string) => {
    dispatch({ field, value });
  }, []);

  function validateStep1() {
    if (!form.name.trim() || form.name.length > 30) {
      return "Name is required (max 30 chars)";
    }
    if (!/^\d{12}$/.test(form.aadhaar)) {
      return "Aadhaar must be exactly 12 digits";
    }
    if (!form.social) {
      return "Please select your social status";
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      return "Mobile must be exactly 10 digits";
    }
    if (!form.category) {
      return "Please select a category";
    }
    return null;
  }

  function validateStep2() {
    if (!form.q1) return "Please answer Question 1";
    if (!form.q2) return "Please answer Question 2";
    if (form.feedback.length > 500) return "Feedback must be under 500 characters";
    return null;
  }

  function onNext() {
    const err = validateStep1();
    if (err) {
      toast.error(err);
      return;
    }
    setStep(2);
  }

  function onBack() {
    setStep(1);
  }

  function onSubmit() {
    const err = validateStep2();
    if (err) {
      toast.error(err);
      return;
    }
    saveSurvey(form);
    navigate({ to: "/success" });
  }

  return (
    <main className="min-h-screen bg-background pb-10">
      <header
        className="px-5 pt-12 pb-6 text-white"
        style={{ background: "var(--grad-primary)" }}
      >
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="rounded-full bg-white/15 p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">EDII RAMP Survey</h1>
        </div>
        <div className="mt-5">
          <p className="text-xs text-white/80 mb-2">Step {step} of 2</p>
          <Progress value={step === 1 ? 50 : 100} className="h-1.5 bg-white/20" />
        </div>
      </header>

      <div className="px-5 -mt-3">
        <div
          className="rounded-2xl bg-card p-5 shadow-sm space-y-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {step === 1 ? (
            <PersonalDetails form={form} set={set} onNext={onNext} />
          ) : (
            <Questions form={form} set={set} onBack={onBack} onSubmit={onSubmit} />
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function PersonalDetails({
  form,
  set,
  onNext,
}: {
  form: SurveyForm;
  set: (k: keyof SurveyForm, v: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <Field label="1. Name (Max 30 characters)" hint={`${form.name.length}/30`}>
        <Input
          value={form.name}
          maxLength={30}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Enter your full name"
          className="h-12 rounded-xl"
        />
      </Field>

      <Field label="2. Gender">
        <RadioGroup
          value={form.gender}
          onValueChange={(v) => set("gender", v)}
          className="flex gap-5 pt-1"
        >
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={g} id={g} /> {g}
            </label>
          ))}
        </RadioGroup>
      </Field>

      <Field label="3. Aadhaar Number (12 digits)" hint={`${form.aadhaar.length}/12`}>
        <Input
          inputMode="numeric"
          value={form.aadhaar}
          maxLength={12}
          onChange={(e) => set("aadhaar", e.target.value.replace(/\D/g, ""))}
          placeholder="Enter Aadhaar number"
          className="h-12 rounded-xl"
        />
      </Field>

      <Field label="4. Social Status">
        <Select value={form.social} onValueChange={(v) => set("social", v)}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue placeholder="Select Social Status" />
          </SelectTrigger>
          <SelectContent>
            {["General", "OBC", "SC", "ST", "EWS"].map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="5. Mobile Number (10 digits)" hint={`${form.mobile.length}/10`}>
        <Input
          inputMode="numeric"
          value={form.mobile}
          maxLength={10}
          onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
          placeholder="Enter mobile number"
          className="h-12 rounded-xl"
        />
      </Field>

      <Field label="6. Category Responder">
        <Select value={form.category} onValueChange={(v) => set("category", v)}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue placeholder="Select Category Responder" />
          </SelectTrigger>
          <SelectContent>
            {["Entrepreneur", "Student", "Trainer", "Mentor", "Other"].map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1 h-12 rounded-xl" asChild>
          <Link to="/dashboard">Cancel</Link>
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-12 rounded-xl font-semibold"
          style={{ background: "var(--grad-accent)" }}
        >
          Next
        </Button>
      </div>
    </>
  );
}

function Questions({
  form,
  set,
  onBack,
  onSubmit,
}: {
  form: SurveyForm;
  set: (k: keyof SurveyForm, v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <Field label="7. Question 1">
        <Select value={form.q1} onValueChange={(v) => set("q1", v)}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue placeholder="Select your answer" />
          </SelectTrigger>
          <SelectContent>
            {["Option A", "Option B", "Option C", "Option D"].map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="8. Question 2">
        <Select value={form.q2} onValueChange={(v) => set("q2", v)}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue placeholder="Select your answer" />
          </SelectTrigger>
          <SelectContent>
            {["Option A", "Option B", "Option C", "Option D"].map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="9. Feedback / Suggestions" hint={`${form.feedback.length}/500`}>
        <Textarea
          value={form.feedback}
          maxLength={500}
          onChange={(e) => set("feedback", e.target.value)}
          placeholder="Write your suggestions here..."
          className="min-h-28 rounded-xl"
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onBack}
        >
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1 h-12 rounded-xl font-semibold"
          style={{ background: "var(--grad-accent)" }}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
