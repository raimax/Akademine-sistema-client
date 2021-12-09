import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  let token = req.cookies["jwt"];

  const response = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/Auth/isAuthed",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    return NextResponse.next();
  }

  return NextResponse.redirect("/");
}
