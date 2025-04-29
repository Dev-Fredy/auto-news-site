self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("news-cache").then((cache) => {
        return cache.addAll(["/", "/favicon.ico", "/manifest.json"]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  
  self.addEventListener("push", (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon.ico",
      data: { url: data.url },
    });
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
  });