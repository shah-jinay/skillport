export async function logVisit(path) {
  try {
    await fetch("http://localhost:8000/events/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  } catch (e) {
    console.error("Failed to log visit:", e);
  }
}
