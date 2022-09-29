{
  const MAX = 1e5;
  const OQ = 'queryHistory';
  const OR = 'removeVisits';
  const REG = /xiao/i;
  const copy = window.copy;

  window.hm = {
    REG,
    query,
    remove,
    stat,
    backup,
  };

  function query(searchReg) {
    console.log('🍵 querying...');

    window.cr.webUIResponse = (id, isSuccess, response) => {
      const historyList = response?.value || [];
      const matchedList = historyList.filter((v) =>
        searchReg ? searchReg.test(v.url) : v.url
      );

      console.log('🚀 query done!');
      console.log(
        'MATCHED/TOTAL:',
        `${matchedList.length}/${historyList.length}`
      );
    };

    queryAllHistories();
  }

  function remove(skipReg) {
    console.log('🍵 removing...');

    window.cr.webUIResponse = (id, isSuccess, response) => {
      const historyList = response?.value || [];
      console.log(id, isSuccess ? 'success' : 'failed', historyList.length);

      if (isSuccess && id.startsWith(OQ) && id !== OQ) {
        return console.log('🚀 remove done!');
      }

      if (!isSuccess || id !== OQ) return;

      const exSet = new Set();
      const rmList = historyList
        .filter((v) => {
          return skipReg ? !skipReg.test(v.url) : v.url;
        })
        .filter((v) => {
          const key = new URL(v.url).host;
          const existed = exSet.has(key);
          exSet.add(key);
          return existed;
        })
        .map((v) => ({ url: v.url, timestamps: v.allTimestamps }));

      if (!rmList.length) {
        return console.log('🚀 remove done!');
      }
      removeHistories(rmList);
    };

    queryAllHistories();
  }

  function stat(byOrigin) {
    console.log('🍵 stating...');

    window.cr.webUIResponse = (id, isSuccess, response) => {
      const entries = formatHistories(response?.value || [], byOrigin);
      console.log('🚀 stat done!');
      console.log(
        entries
          .map((e) => `${String(e[1]).padStart(5, ' ')} , ${e[0]}`)
          .join('\n')
      );
    };

    queryAllHistories();
  }

  function backup(byOrigin) {
    console.log('🍵 backup...');

    window.cr.webUIResponse = (id, isSuccess, response) => {
      const entries = formatHistories(response?.value || [], byOrigin);
      const res = entries.map((e) => e[0]).join('\n');
      copy(res);

      console.log('🚀 backup done! results were copied to clipboard!');
      console.log(res);
    };

    queryAllHistories();
  }

  /** utils and other codes **/

  function formatHistories(historyList, byOrigin) {
    const urlMap = historyList?.reduce((map, v) => {
      const key = byOrigin ? new URL(v.url).origin : v.url;
      const count = map.get(key) || 0;
      return map.set(key, count + 1);
    }, new Map());

    return [...urlMap.entries()].sort((a, b) => b[1] - a[1]);
  }

  function queryAllHistories() {
    chrome.send(OQ, [OQ, '', MAX]);
  }

  function removeHistories(historyList) {
    chrome.send(OR, [OR, historyList]);
  }
}
