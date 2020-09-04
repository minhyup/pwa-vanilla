const appVersion = "23";

// 캐시 제목
const sCahceName = `minhyup-pwa${appVersion}`;

// 캐시할 파일 목록 선언
const aFilesToCache = [
  "./",
  "./manifest.json",
  "./images/hello-pwa.png",
  "./images/icons/android-chrome-512x512.png",
  "./images/icons/android-chrome-192x192.png",
];

// 서비스 워커 install 후 캐시 파일 저장
// INSTALL - 캐시스토리지에 파일 저장 용도
self.addEventListener("install", (pEvent) => {
  console.log("서비스 워커 install 완료::", pEvent);

  // 캐시스토리지에 파일 저장
  pEvent.waitUntil(
    caches.open(sCahceName).then((pCache) => {
      console.log(
        `캐시스토리지를 ${sCahceName} 이름으로 열고 파일을 캐시로 저장한다.`
      );
      return pCache.addAll(aFilesToCache);
    })
  );
});

// activate!!
// 고유 번호를 받은 서비스 워커가 작동한다.
// 기존 캐시를 제거한다.
self.addEventListener("activate", (pEvent) => {
  console.log("activate !! ", pEvent);
  // const chacheWhilteList = [];
  // chacheWhilteList.push(sCacheName);
  // pEvent.waitUntil(
  //   caches.keys().then(function (cacheNames) {
  //     return Promise.all(
  //       cacheNames.map(function (cacheName) {
  //         if (!chacheWhilteList.includes(cacheName)) {
  //           return caches.delete(cacheName);
  //         }
  //       })
  //     );
  //   })
  // );
});

// 데이터 요청을 받으면 네트워크 또는 캐시에서 찾아 반환한다.
// 브라우저가 서버에 HTTP를 요청했을 때 오프라인 상태면 캐시 파일 읽기
self.addEventListener("fetch", (pEvent) => {
  console.log("fetch!! ", pEvent);
  console.log("request::", pEvent.request);

  // Prevent the browser's default fetch handling, and provide a response
  // 브라우저의 기본 페치 핸들링을 막고 응답을 제공한다.
  pEvent.respondWith(
    caches.match(pEvent.request).then((response) => {
      console.log("response:::", response);
      // 캐시스토리지에 없다면 네트워크 요청을 한다.
      if (!response) {
        console.log("네트워크에서 데이터 요청!!!!!", pEvent.request);
        return fetch(pEvent.request);
      }

      // 아니면 캐시에서 받은 데이터를 응답 데이터로 리턴한다.
      console.log("캐시스토리지에서 데이터 요청!", pEvent.request);
      return response;
    })
  );
});

// 클라이언트로부터 postMessge 메서드를 수신하기 위해 이벤트리스너 등록
self.addEventListener("message", function (pEvent) {
  console.log("message Event!!!", pEvent);

  if (pEvent.data.action === "skipWaiting") {
    // waiting 상태의 서비스 워커를 active 상태의 서비스 워커로 변경하도록 갱신한다.
    self.skipWaiting();
  }
});
