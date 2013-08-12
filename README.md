Arachnid
========

Arachnid consists of a Chrome extension called Pathmarks and a knowledge web tentatively named Spiderweb.


Pathmarks
---------
Pathmarks let you visualize your path through the web. You can choose to pathmark a page (get only the path to that website),
recent pages, or an entire browsing session.

Choosing to View Pathmarks displays a graph of visited pages represented by their favicons.

The default visualization locks the x-coordinate of each node in a position proportional to
the time the page was accessed with respect to other pages in the pathmark.

This constraint can be removed by hitting the Tab key. 

In the visualization:
* Mouse-over: displays the URL of the node
* Esc: quits out of the extension
* Tab: switches to a regular force-directed graph visualization (and back)
* Clicking on background: quits out of the extension
* Clicking on a node: opens the URL of the node in a new, inactive tab
* Dragging a node: repositions the node and fixes it in the new position

The extension can be found here: https://chrome.google.com/webstore/detail/pathmarks/pljlfppjejnlldkimmillfglpmdbhjek

Spiderweb
---------
Each pathmarks documents the sites a user navigated through before finding their desired information.
As such, membership in a pathmark is a vastly more useful measure of the importance of a page with regards
to a particular search query than link-based metrics such as PageRank. 

An optional setting in the Pathmarks extension will allow users to anonymously send their pathmarks to Spiderweb.
Spiderweb will then aggregate the pathmarks to provide recommendations based on a given URL or search query.


