const API_URL = "https://script.google.com/macros/s/AKfycbzcfhUkuz5h5V5qn0iJroJplzvmiKhSDAAgyEBd0AwhNGXwSXGnsmv6gKcdnYHZ9de9/exec";

function formatDateTime(value) {
  if (!value) return '';
  const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]} ${iso[4]}:${iso[5]}:${iso[6]}`;
  }
  return value;
}

async function getAllTickets() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data.success) return data.tickets;
    return [];
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    return [];
  }
}

async function addTicket(ticket) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "addTicket", ...ticket })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to add ticket:", err);
    return { success: false };
  }
}

async function updateTicket(ticket) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "updateTicket", ...ticket })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to update ticket:", err);
    return { success: false };
  }
}

async function deleteTicket(id) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "deleteTicket", id })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to delete ticket:", err);
    return { success: false };
  }
}