(function () {
  const endpoint = "https://hxunrhnljvfvcjpmdpnb.supabase.co/functions/v1/lemonade-tours?availability=melbourne";

  function showLiveAvailability(count, capacity) {
    if (!Number.isFinite(count) || !Number.isFinite(capacity) || count > Math.floor(capacity / 2)) return;
    const label = `${count} ${count === 1 ? "appointment" : "appointments"} left`;
    document.querySelectorAll("[data-live-availability], .announce-availability b").forEach((element) => {
      element.textContent = label;
    });
  }

  fetch(endpoint, { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      if (!data || data.ok === false) return;
      showLiveAvailability(Number(data.appointments_left), Number(data.capacity));
    })
    .catch(() => {});
})();
