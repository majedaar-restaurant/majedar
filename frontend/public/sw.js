self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const options = {
    body: data.body || "",
    icon: data.icon || "/brand/logo-full.png",
    badge: data.badge || "/brand/logo-mark.svg",
    data: data.data || {},
    tag: data.data?.notificationId || data.data?.assignmentId || data.data?.event || "rider-update",
    renotify: false,
  };
  event.waitUntil(self.registration.showNotification(data.title || "Majedaar Rider", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/rider/dashboard", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    for (const client of clients) {
      if (new URL(client.url).origin === self.location.origin) {
        return client.navigate(target).then((windowClient) => windowClient?.focus());
      }
    }
    return self.clients.openWindow(target);
  }));
});
