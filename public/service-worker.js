const files_to_cache=[
  "../index.html"
]
const app_prefix= "budget-app"
const version = "v1"
const Cache_Name=app_prefix+version

self.addEventListener("install",(event)=>{
  event.waitUntil(
      caches.open(Cache_Name)
      .then((cache)=>{
          console.log("installing cache");
          return cache.addAll(files_to_cache)//create cache when installed and save all files to cache
      })
  )
})

self.addEventListener('activate', function(e) {//delete old caches
console.log("service worker activated");
  e.waitUntil(
    caches.keys().then(function(keyList) {
      let cacheKeeplist = keyList.filter(function(key) {
        return key.indexOf(app_prefix);
      });
      cacheKeeplist.push(Cache_Name);
      return Promise.all(
        keyList.map(function(key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch",(event)=>{
  console.log("fetch request: ",event.request.url);
  console.log("caches: ",caches);
  event.respondWith(
      caches.match(event.request)
      .then((request)=>{
          if (request){
              console.log("responding with cache: ",event.request.url);//respond with cache
              return request
          }else{
              console.log("file is not cached, fetching : ",event.request.url);//respond with request 
              return fetch(event.request)
          }
      })
  )
})