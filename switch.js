var main = function () {
  var menu = document.getElementById('menu');
  var none = document.getElementById('none');

  chrome.storage.sync.get('my_projects', function (obj) {
    var projects = obj.my_projects;
    for (name in projects) {
      if (name != 'my_current_project') {
        var a = document.createElement('a');
        var linkText = document.createTextNode(name);
        a.appendChild(linkText);
        a.href = "#";
        a.id = name;

        if (name === projects.my_current_project) {
          a.className = "choice selected";
          none.className = "choice";
        } 
        else {
          a.className = "choice";
        }

        a.onclick = function (event) {
          oldProj = document.getElementById(projects.my_current_project);
          oldProj.className = "choice";
          none.className = "choice";
          event.target.className = "choice selected";
          projects.my_current_project = event.target.id;
          chrome.storage.sync.set({'my_projects': projects});
        };

        menu.appendChild(a);
        var d = document.createElement('li');
        d.className = "divider";
        menu.appendChild(d);
      }
    }
  });

  var newProj = document.getElementById('newProject');
  newProj.onclick = newProject;

  none.onclick = function (event) {
    chrome.storage.sync.get('my_projects', function (obj) {
      var projects = obj.my_projects || {};
      oldProj = document.getElementById(projects.my_current_project);
      oldProj.className = "choice";
      event.target.className = "choice selected";
      projects.my_current_project = 'none';
      chrome.storage.sync.set({'my_projects': projects});
    });
  }

}

var newProject = function () {
  window.location.replace("new_project.html");
}

document.addEventListener('DOMContentLoaded', main);
