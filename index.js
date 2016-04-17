function test(name, list, type, next) {
  if (type === 'whitelist' && list.indexOf(name) !== -1) {
    return next();
  }
  if (type === 'blacklist' && list.indexOf(name) === -1) {
    return next();
  }
}

function list(type, channelList, webClient) {
  return function (next, event, data) {
    webClient.channels.info(data.channel, (error, response) => {
      if (error) {
        return;
      }

      if (!response.ok) {
        // We're not in a channel, try group
        return webClient.groups.info(data.channel, function (error, response) {
          if (error) {
            return;
          }
          if (!response.ok) {
            // We're not in a group either, keep going.
            return next();
          }

          // Exit
          return test(response.group.name, channelList, type, next);

        });
      }

      // Exit
      return test(response.channel.name, channelList, type, next);
    });
  };
};

module.exports = {
  whitelist: list.bind(null, 'whitelist'),
  blacklist: list.bind(null, 'blacklist')
};
