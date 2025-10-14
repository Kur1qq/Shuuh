export const API_URL = "http://localhost:4000/api/offenders";

export async function addOffender(data) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function getOffenders() {
  const res = await fetch(API_URL);
  return res.json();
}

export function downloadDocx(id) {
  window.open(`${API_URL}/${id}/docx`, "_blank");
}
