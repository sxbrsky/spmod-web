const url = "http://localhost:8080";

function createNode(element) {
	return document.createElement(element);
}

function append(parent, el) {
	return parent.appendChild(el);
}

function createModal(build, builds) {
  //append(document.querySe)
	var modal = `<div class="modal modal-sm" id=${build}>
<div class="modal-container">
<div class="modal-header">
<a href="#close" class="modal-overlay" aria-label="Close"></a>
<div class="modal-title h5">Build ${build}</div></div>
<div class="modal-body">
  `;
	builds.forEach(item => {
      modal += "<div class='columns'>";
      if (item.system == "linux") {
			modal += `<div class='column'><i class="fab fa-linux"></i><br>
                    ${item.compiler} - ${item.type} <a href="${url}/builds/${item.file}"><i class="fas fa-angle-double-down"></i></a>
                </div>`
      } else if (item.system == "windows") {
			modal += `<div class='column'>
                    <i class="fab fa-windows"></i><br>
                    ${item.compiler} - ${item.type} <a href="${url}/builds/${item.file}"><i class="fas fa-angle-double-down"></i></a>
                  </div>`
		}
  })
  modal += "</div></div></div></div>";
	return modal;
}

fetch(url + "/build")
	.then(data => data.json())
	.then(data => {
		const tbody = createNode("tbody");
		append(document.querySelector('table'), tbody);
		data.forEach(item => {
			let tr = createNode('tr'),
				build = createNode('td'),
				details = createNode('td'),
				download = createNode('td'),
				source = createNode('td');

			console.log(item.builds);
			build.innerHTML += item.build;
			details.innerHTML += item.message;
			download.innerHTML += `<a href="#${item.build}"><i class="fas fa-cloud-download-alt"></i></a>`;
			source.innerHTML += `<a href="http://github.com/Amaroq7/SPMod/tree/${item.commit}/"><i class="fab fa-github"></i></a>` + createModal(item.build, item.builds);


			append(tr, build);
			append(tr, details);
			append(tr, download);
			append(tr, source);
			append(tbody, tr);

		});
	})

