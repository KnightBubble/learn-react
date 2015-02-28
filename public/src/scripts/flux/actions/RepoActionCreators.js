'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    RepoAPI = require('../utils/RepoAPI'),
    StarredReposByUserStore = require('../stores/StarredReposByUserStore'),
    RepoStore = require('../stores/RepoStore');

var RepoActionCreators = {
  requestRepo(fullName, fields) {
    if (RepoStore.contains(fullName, fields)) {
      return;
    }
    
    // Although this action is currently not handled by any store,
    // it is fired for consistency. You might want to use it later,
    // e.g. to show a spinner or have a more detailed log.

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_REPO,
      fullName: fullName
    });

    RepoAPI.requestRepo(fullName);
  },

  requestStarredReposPage(login, isInitialRequest) {
    if (StarredReposByUserStore.isExpectingPage(login) ||
        StarredReposByUserStore.isLastPage(login)) {
      return;
    }

    if (isInitialRequest && StarredReposByUserStore.getPageCount(login) > 0) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
      login: login
    });

    var nextPageUrl = StarredReposByUserStore.getNextPageUrl(login);
    RepoAPI.requestStarredReposPage(login, nextPageUrl);
  }
};

module.exports = RepoActionCreators;
