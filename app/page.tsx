import { redirect } from "next/navigation";

// Server Component: redireciona imediatamente para /conversations
export default function HomePage() {
  redirect("/conversations");
}
