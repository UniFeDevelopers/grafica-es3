/*
  Esercitazione 3 - Esercizio 1

  Gruppo:
    - Bulzoni Federico
    - Guerra Antonio
    - Zambello Nicola
*/

// Vertex shader program
const vertexShaderSource = `
  attribute vec4 a_Position;   // Vertex coordinates
  uniform mat4 u_MvpMatrix;    // Model-View-Projection Matrix
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }
`

// Fragment shader program
const fragmentShaderSource = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;

  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }
`

class Shape {
  constructor() {
    this.vertices = []
    this.texCoord = []
    this.indices = []
    this.cameraPos = new Vector3([0.0, 0.0, 6.0])
  }
}

class Cube extends Shape {
  constructor() {
    super()
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    // Coordinates

    // prettier-ignore
    this.vertices = [
      1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,  1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
      1.0, 1.0, 1.0,   1.0, 1.0,-1.0,   -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,  1.0,-1.0,-1.0,   1.0,-1.0, 1.0,   -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
      1.0,-1.0,-1.0,   -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,  1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]

    // prettier-ignore
    this.texCoord = [
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v0-v1-v2-v3 front
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,  // v0-v3-v4-v5 right
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,  // v0-v5-v6-v1 up
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v1-v6-v7-v2 left
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,  // v7-v4-v3-v2 down
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0   // v4-v7-v6-v5 back
    ]

    // Indices of the vertices
    // prettier-ignore
    this.indices = [
      0,  1,  2,   0, 2,  3,     // front
      4,  5,  6,   4, 6,  7,     // right
      8,  9,  10,  8, 10, 11,    // up
      12, 13, 14, 12, 14, 15,    // left
      16, 17, 18, 16, 18, 19,    // down
      20, 21, 22, 20, 22, 23     // back
    ]

    this.cameraPos = new Vector3([0.0, 0.0, 7.0])
  }
}

class Cone extends Shape {
  constructor(nDiv, radius, height) {
    super()

    const numberVertices = nDiv + 2
    const angleStep = 2 * Math.PI / nDiv
    const centre = [0.0, 0.0, 0.0]
    const top = [0.0, height, 0.0]

    this.vertices.push(...centre)

    this.vertices.push(...top)

    // genero tutti i vertici
    for (let i = 2, angle = 0; i < numberVertices; i++, angle += angleStep) {
      let x = Math.cos(angle) * radius
      let z = Math.sin(angle) * radius
      let y = centre[1]

      this.vertices.push(x, y, z)

      if (i < numberVertices - 1) {
        // Collego il vertice al suo precedente e al top.
        this.indices.push(0, i, i + 1)
        // Collego il vertice al suo precedente e al centro basso.
        this.indices.push(1, i, i + 1)
      } else {
        // Nel caso sia l'ultimo vertice allora lo collego col primo sulla circonferenza.
        this.indices.push(0, i, 2)
        this.indices.push(1, i, 2)
      }
    }

    this.cameraPos = new Vector3([0.0, 0.0, 8.0])
  }
}

class Cylinder extends Shape {
  constructor(nDiv, radius, height) {
    super()

    const angleStep = 2 * Math.PI / nDiv

    // Due centri, uno in basso ed uno in alto.
    const centreBottom = [0.0, 0.0, 0.0]
    const centreTop = [0.0, height, 0.0]

    this.vertices.push(...centreBottom) // Indice 0

    this.vertices.push(...centreTop) // Indice 1

    // Carico dalla posizione 2 ad nDiv + 1 i vertici della circonferenza inferiore.
    for (let i = 0, angle = 0; i < nDiv; i++, angle += angleStep) {
      let x = Math.cos(angle) * radius
      let z = Math.sin(angle) * radius

      this.vertices.push(x, centreBottom[1], z) // i ed è il vertice in basso
    }

    // Carico dalla posizione nDiv + 2 ad 2*nDiv + 1 i vertici della circonferenza superiore
    for (let j = 0, angle = 0; j < nDiv; j++, angle += angleStep) {
      let x = Math.cos(angle) * radius
      let z = Math.sin(angle) * radius

      this.vertices.push(x, centreTop[1], z) // i ed è il vertice in basso
    }

    // Itero da 0 a nDiv - 1 per inserire gli indici nel buffer.
    for (let k = 0; k < nDiv; k++) {
      let i = k + 2 // Indice che scorre i vertici della circonferenza inferiore.
      let j = i + nDiv // Indice che scorre i vertici della circonferenza superiore.

      // Se non stiamo considerando gli ultimi vertici sulle circonferenze.
      if (k < nDiv - 1) {
        // Disegnamo le due circonferenze come al solito.
        this.indices.push(i, i + 1, 0)
        this.indices.push(j, j + 1, 1)

        // Disegniamo la maglia costruendo quadrati formati da due triangoli.
        /*
         j      j+1
          + - - +
          |     |
          |     |
          + - - +
         i       i+1
        */

        this.indices.push(i, i + 1, j)
        this.indices.push(j, j + 1, i + 1)
      } else {
        // Come al solito gli ultimi vertici sulle circonferenze vanno uniti coi primi.
        // Il primo vertice della circonferenza inferiore è 2.
        // Il primo vertice della circonferenza superiore è nDiv + 2.
        this.indices.push(i, 2, 0)
        this.indices.push(j, nDiv + 2, 1)

        this.indices.push(i, 2, j)
        this.indices.push(j, nDiv + 2, 2)
      }
    }

    this.cameraPos = new Vector3([0.0, 0.0, 10.0])
  }
}

class Sphere extends Shape {
  constructor(nDiv, radius) {
    super()

    // Per disegnare una sfera abbiamo bisogno di nDiv^2 vertici.
    // Il ciclo for più esterno è quello che itera sull'angolo phi, ossia quello che ci fa passare da
    // una circonferenza alla sua consecutiva.
    for (let j = 0; j <= nDiv; j++) {
      // L'angolo phi è compresto tra 0 e Pi
      let phi = j * Math.PI / nDiv

      // Il ciclo for più interno è quello che itera sull'angolo theta, ossia quello che ci fa passare da un vertice
      // al suo successivo sulla stessa circonferenza.
      for (let i = 0; i <= nDiv; i++) {
        // L'angolo theta è compreso tra 0 e 2 * Pi.
        let theta = i * 2 * Math.PI / nDiv

        // Il calcolo delle coordinate di un vertice avviene tramite le equazioni parametriche della sfera.
        // let x = Math.cos(phi) * Math.sin(theta)
        // let y = Math.sin(phi) * Math.sin(theta)
        // let z = Math.cos(theta)
        let x = Math.sin(theta) * Math.sin(phi)
        let y = Math.cos(phi)
        let z = Math.cos(theta) * Math.sin(phi)

        this.vertices.push(radius * x, radius * y, radius * z)

        let u = theta / (2 * Math.PI)
        let v = 1 - phi

        this.texCoord.push(u, v)
      }
    }

    // Inizializzazione degli indici, il significato dei cicli for è sempre lo stesso.
    for (let j = 0; j < nDiv; j++) {
      for (let i = 0; i < nDiv; i++) {
        // p1 è un punto su di una circonferenza.
        let p1 = j * (nDiv + 1) + i
        // p2 è il punto sulla circonferenza superiore a quella di p1, nella stessa posizione di p1.
        let p2 = p1 + (nDiv + 1)

        // I punti vanno uniti come nel cilindro per formare dei quadrati.
        this.indices.push(p1, p2, p1 + 1)
        this.indices.push(p1 + 1, p2, p2 + 1)
      }
    }
  }
}

class Torus extends Shape {
  constructor(nDiv, radius, radiusInner) {
    super()

    // I vertici e gli indici del toro vengono calcolati come per la sfera
    // cambia solamente l'angolo phi che arriva fino a 2 PI
    // e chiaramente le coordinate dei vertici in funzione della
    // formula parametrica del toro

    for (let j = 0; j <= nDiv; j++) {
      let phi = j * 2 * Math.PI / nDiv

      for (let i = 0; i <= nDiv; i++) {
        let theta = i * 2 * Math.PI / nDiv

        let x = Math.sin(phi) * (radius + radiusInner * Math.cos(theta))
        let y = Math.cos(phi) * (radius + radiusInner * Math.cos(theta))
        let z = Math.sin(theta) * radiusInner

        this.vertices.push(x, y, z)
      }
    }

    for (let j = 0; j < nDiv; j++) {
      for (let i = 0; i < nDiv; i++) {
        let p1 = j * (nDiv + 1) + i
        let p2 = p1 + (nDiv + 1)

        this.indices.push(p1, p2, p1 + 1)
        this.indices.push(p1 + 1, p2, p2 + 1)
      }
    }
  }
}

const main = () => {
  // Retrieve <canvas> element
  const canvas = document.querySelector('canvas#webgl-es3')
  canvas.setAttribute('width', window.innerWidth)
  canvas.setAttribute('height', window.innerHeight)

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL')
    return
  }

  // Initialize shaders
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) {
    console.log('Failed to intialize shaders.')
    return
  }

  // set default shape to cube and init
  let shape = new Cube([255, 0, 0])

  let n = initVertexBuffers(gl, shape)
  if (n < 0) {
    console.log('Failed to set the vertex information')
    return
  }

  // Set texture
  if (!initTextures(gl)) {
    console.log('Failed to intialize the texture.')
    return
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST)

  // Get the storage locations of uniform variables and so on
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location')
    return
  }

  let vpMatrix = new Matrix4() // View projection matrix

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
  vpMatrix.lookAt(...shape.cameraPos.elements, 0, 0, 0, 0, 1, 0)

  let currentAngle = 0.0 // Current rotation angle
  const modelMatrix = new Matrix4() // Model matrix
  const mvpMatrix = new Matrix4() // Model view projection matrix

  const shapeOptions = {
    cone: [200, 1, 2],
    cylinder: [100, 1, 2],
    sphere: [100, 1],
    torus: [100, 1, 0.2],
  }

  //*********************************************************************
  // creo una GUI con dat.gui
  const gui = new dat.GUI()
  // checkbox geometry
  let geometria = { cube: true, cone: false, cylinder: false, sphere: false, torus: false }

  gui.add(geometria, 'cube').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = value
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new Cube()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt(...shape.cameraPos.elements, 0, 0, 0, 0, 1, 0)

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'cone').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = value
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new Cone(...shapeOptions.cone)

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt(...shape.cameraPos.elements, 0, 0, 0, 0, 1, 0)

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'cylinder').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = value
      geometria.sphere = false
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new Cylinder(...shapeOptions.cylinder)

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt(...shape.cameraPos.elements, 0, 0, 0, 0, 1, 0)

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'sphere').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = value
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new Sphere(...shapeOptions.sphere)

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt(...shape.cameraPos.elements, 0, 0, 0, 0, 1, 0)

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'torus').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = value
    }

    // update shape object and re-init buffers
    shape = new Torus(...shapeOptions.torus)

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt(...shape.cameraPos.elements, 0, 0, 0, 0, 1, 0)

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  // Forza i checkbox perchè non vengano deselezionati
  // per evitare lo stato in cui nessuno sia selezionato
  document.querySelectorAll('input[type="checkbox"').forEach(el => {
    el.onchange = e => {
      if (!e.target.checked) {
        e.target.checked = true
      }
    }
  })

  //*********************************************************************************
  const tick = () => {
    currentAngle = animate(currentAngle) // Update the rotation angle
    // Calculate the model matrix
    modelMatrix.setRotate(currentAngle, 0, 1, 0) // Rotate around the axis

    mvpMatrix.set(vpMatrix).multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0)

    requestAnimationFrame(tick, canvas) // Request that the browser calls tick
  }
  tick()
}

const initVertexBuffers = (gl, shape) => {
  const vertices = new Float32Array(shape.vertices)
  const indices = new Uint16Array(shape.indices)
  const texCoord = new Float32Array(shape.texCoord)

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1
  if (!initArrayBuffer(gl, 'a_TexCoord', texCoord, gl.FLOAT, 2)) return -1

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  // Write the indices to the buffer object
  let indexBuffer = gl.createBuffer()
  if (!indexBuffer) {
    console.log('Failed to create the buffer object')
    return false
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return indices.length
}

const initArrayBuffer = (gl, attribute, data, type, num) => {
  // Create a buffer object
  let buffer = gl.createBuffer()
  if (!buffer) {
    console.log('Failed to create the buffer object')
    return false
  }

  // Write data into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // verticesColor
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute)
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute)
    return false
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute)
  return true
}

// Rotation angle (degrees/second)
const ANGLE_STEP = 5.0

// Last time that this function was called
let g_last = Date.now()

const animate = angle => {
  // Calculate the elapsed time
  let now = Date.now()
  const elapsed = now - g_last
  g_last = now

  // Update the current rotation angle (adjusted by the elapsed time)
  let newAngle = angle + ANGLE_STEP * elapsed / 200.0
  return (newAngle %= 360)
}

const initTextures = gl => {
  const texture = gl.createTexture() // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object')
    return false
  }

  // Get the storage location of u_Sampler
  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')
  if (!u_Sampler) {
    console.log('Failed to create the Sampler object')
    return false
  }

  const image = new Image() // Create the image object
  if (!image) {
    console.log('Failed to create the image object')
    return false
  }

  // Register the event handler to be called on loading an image
  image.onload = function() {
    loadTexture(gl, texture, u_Sampler, image)
  }

  // Tell the browser to load an image
  image.src = './textures/ash_uvgrid01.jpg'

  return true
}

const loadTexture = (gl, texture, u_Sampler, image) => {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0)
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0)

  gl.clear(gl.COLOR_BUFFER_BIT) // Clear <canvas>
}

main()
