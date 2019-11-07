const thead = documnet.querySelector("#builds");

function createNode(element) {
    return document.createElement(element); 
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }

fetch("https://spmod.eu/build/").then( resp => {
    resp.forEach(build => {
        let tr = createNode('tr'),
            build = createNode('td'),
            details = createNode('td'),
            download = createNode('td'),
            source = createNode('td');

    

  })
});