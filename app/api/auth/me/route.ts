import { getCurrentUser } from "@/lib/auth";
import { jsonOk } from "@/lib/api-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return jsonOk({ user: null }, 200);
  }
  return jsonOk({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
