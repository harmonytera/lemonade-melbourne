(function () {
  const endpoint = "https://hxunrhnljvfvcjpmdpnb.supabase.co/functions/v1/lemonade-tours?availability=melbourne";

  function plural(count, singular, pluralText) {
    return count === 1 ? singular : pluralText;
  }

  function replaceAvailabilityText(count, capacity) {
    const full = `${count} of ${capacity} ${plural(count, "appointment", "appointments")} open`;
    const short = `${count} of ${capacity} left`;
    const mobile = `${count} ${plural(count, "appointment", "appointments")} · Melbourne`;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      node.nodeValue = node.nodeValue
        .replace(/\b\d+\s+of\s+12\s+appointments?\s+open\b/g, full)
        .replace(/\b\d+\s+of\s+12\s+left\b/g, short)
        .replace(/\b\d+\s+appointments?\s+·\s+Melbourne\b/g, mobile);
    });
  }

  fetch(endpoint, { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      if (!data || data.ok === false) return;
      replaceAvailabilityText(Number(data.appointments_left), Number(data.capacity));
    })
    .catch(() => {});
})();
