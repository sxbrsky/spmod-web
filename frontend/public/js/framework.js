const url = "http://spmod.eu/api/";

function createNode(element) {
	return document.createElement(element);
}

function append(parent, el) {
	return parent.appendChild(el);
}

function createModal(build, builds) {
	var modal = `<div id=${build} class="overlay light">
	<a class="cancel" href="#"></a>
	<div class="modal">
	<h2> build ${build}
  `;
	builds.forEach(item => {
      if (item.system == "linux") {
			modal += `<i class="fab fa-linux"></i><br>
                    ${item.compiler} - ${item.type} <a href="${url}/builds/${item.file}"><i class="fas fa-angle-double-down"></i></a>`
      } else if (item.system == "windows") {
			modal += `<div class='column'>
                    <i class="fab fa-windows"></i><br>
                    ${item.compiler} - ${item.type} <a href="${url}/builds/${item.file}"><i class="fas fa-angle-double-down"></i></a>`
		}
  })
  modal += "</div></div>";
	return modal;
}

fetch(url + '/build/')
	.then(data => data.json())
	.then(data => {
		const tbody = createNode("tbody");
		append(document.querySelector('table'), tbody);
		data.forEach(item => {
			let tr = createNode('tr'),
				build = createNode('td'),
				details = createNode('td'),
				download = createNode('td');

			build.className = "table-content build";
			details.className = "table-content details";
			download.className = "table-content download";

			build.innerHTML += item.build;
			details.innerHTML += `<a href="https://github.com/Amaroq7/SPMod/tree/${item.commit}/"> ${item.message}</a>`;
			download.innerHTML += `<a href="#${item.build}"><i class="far fa-arrow-alt-circle-down"></i></a>`;

			append(tr, build);
			append(tr, download);
			append(tr, details);
			append(tbody, tr);

		});
	})

