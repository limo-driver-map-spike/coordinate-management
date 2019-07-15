// proxy patten
// using proxy patten to cache the image fetched from internet
const fetch = require("node-fetch");
const _ = require("lodash");
const client = require("./../db/redisClient");

const mockImageUrl =
  "http://www.thinklitech.com/static/media/content3.8faf347b.jpg";

const fetchImageRequest = url => {
  return fetch(url)
    .then(res => {
      console.log(res);
      if (res.ok) {
        return res.blob();
      } else {
        console.log(res.statusText);
        return Promise.reject(res.statusText);
      }
    })
    .then(blob => {
      return blob;
    })
    .catch(err => {
      throw new Error("err");
      console.log("Look like there was a problem: \n", err);
    });
};

const proxyFetchImage = new Proxy(fetchImageRequest, {
  get: (target, name, receiver) => {
    console.log(name);
    console.log(target);
  },
  apply: async (target, name, receiver) => {
    const found = await client.get(receiver[0]);
    if (found) {
      // get the response from cache
      console.log("from cache");
      console.log(found);
      return found;
    } else {
      try {
        const value = await Reflect.apply(target, name, receiver);
        await client.set(receiver[0], value.toString("base64"));
        return value;
      } catch (err) {
        console.log(err);
      }
    }
  }
});

proxyFetchImage(mockImageUrl);
