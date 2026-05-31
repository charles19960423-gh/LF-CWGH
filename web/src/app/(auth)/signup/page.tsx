import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "注册",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
