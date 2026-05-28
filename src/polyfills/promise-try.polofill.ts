if (typeof Promise.try !== "function") {
  Promise.try = function (callback) {
    return new Promise((resolve, reject) => {
      try {
        // Resolve with the callback's result (even if it's another promise)
        resolve(callback());
      } catch (error) {
        // Catch synchronous errors and reject the promise
        reject(error);
      }
    });
  };
}
