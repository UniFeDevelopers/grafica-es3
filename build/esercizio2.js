'use strict'

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  } else {
    return Array.from(arr)
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass)
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true },
  })
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass)
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

/*
  Esercitazione 1 - Esercizio 2

  Gruppo:
    - Bulzoni Federico
    - Guerra Antonio
    - Zambello Nicola
*/

// Vertex shader program
var vertexShaderSource =
  '\n  attribute vec4 a_Position;   // Vertex coordinates\n  attribute vec4 a_Color;      // Vertex Color\n  uniform mat4 u_MvpMatrix;    // Model-View-Projection Matrix\n  varying vec4 v_Color;        // vertex color\n\n  void main() {\n    gl_Position = u_MvpMatrix * a_Position;\n    v_Color = normalize(a_Color);\n  }\n'

// Fragment shader program
var fragmentShaderSource =
  '\n  #ifdef GL_ES\n  precision mediump float;\n  #endif\n  varying vec4 v_Color;\n\n  void main() {\n    gl_FragColor = v_Color;\n  }\n'

var Shape = function Shape() {
  _classCallCheck(this, Shape)

  this.vertices = []
  this.colors = []
  this.indices = []
  this.cameraPos = new Vector3([0.0, 0.0, 6.0])
}

var Cube = (function(_Shape) {
  _inherits(Cube, _Shape)

  function Cube(color) {
    _classCallCheck(this, Cube)

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
    var _this = _possibleConstructorReturn(this, (Cube.__proto__ || Object.getPrototypeOf(Cube)).call(this));

    _this.vertices = [
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v0-v3-v4-v5 right
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0, // v0-v5-v6-v1 up
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0, // v1-v6-v7-v2 left
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0, // v7-v4-v3-v2 down
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v4-v7-v6-v5 back
    ]

    // Colors
    // prettier-ignore
    // this.colors = [
    //   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    //   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    //   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    //   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    //   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    //   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
    // ]
    _this.colors = [];
    for (var i = 0; i < _this.vertices.length; i += 3) {
      var _this$colors

      ;(_this$colors = _this.colors).push.apply(_this$colors, _toConsumableArray(color))
    }

    // Indices of the vertices
    // prettier-ignore
    _this.indices = [0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // right
    8, 9, 10, 8, 10, 11, // up
    12, 13, 14, 12, 14, 15, // left
    16, 17, 18, 16, 18, 19, // down
    20, 21, 22, 20, 22, 23 // back
    ];

    _this.cameraPos = new Vector3([0.0, 0.0, 7.0])
    return _this
  }

  return Cube
})(Shape)

var Cone = (function(_Shape2) {
  _inherits(Cone, _Shape2)

  function Cone(nDiv, radius, height, color) {
    var _this2$vertices, _this2$colors, _this2$vertices2, _this2$colors2

    _classCallCheck(this, Cone)

    var _this2 = _possibleConstructorReturn(this, (Cone.__proto__ || Object.getPrototypeOf(Cone)).call(this))

    var numberVertices = nDiv + 2
    var angleStep = 2 * Math.PI / nDiv
    var centre = [0.0, 0.0, 0.0]
    var top = [0.0, height, 0.0]

    ;(_this2$vertices = _this2.vertices).push.apply(_this2$vertices, centre)
    ;(_this2$colors = _this2.colors).push.apply(_this2$colors, _toConsumableArray(color))

    ;(_this2$vertices2 = _this2.vertices).push.apply(_this2$vertices2, top)
    ;(_this2$colors2 = _this2.colors).push.apply(_this2$colors2, _toConsumableArray(color))

    // genero tutti i vertici
    for (var i = 2, angle = 0; i < numberVertices; i++, angle += angleStep) {
      var _this2$colors3

      var x = Math.cos(angle) * radius
      var z = Math.sin(angle) * radius
      var y = centre[1]

      _this2.vertices.push(x, y, z)
      ;(_this2$colors3 = _this2.colors).push.apply(_this2$colors3, _toConsumableArray(color))

      // collego il centro al top ed al nostro vertice
      _this2.indices.push(0, 1, i)

      if (i < numberVertices - 1) {
        // ossia collego il centro, il nostro vertice, e quello successivo
        _this2.indices.push(0, i, i + 1)
      } else {
        // ossia collego il centro, il nostro vertice, e il primo vertice della circonferenza
        _this2.indices.push(0, i, 2)
      }
    }

    _this2.cameraPos = new Vector3([0.0, 0.0, 8.0])
    return _this2
  }

  return Cone
})(Shape)

var Cylinder = (function(_Shape3) {
  _inherits(Cylinder, _Shape3)

  function Cylinder(nDiv, radius, height, color) {
    var _this3$vertices, _this3$colors, _this3$vertices2, _this3$colors2

    _classCallCheck(this, Cylinder)

    var _this3 = _possibleConstructorReturn(this, (Cylinder.__proto__ || Object.getPrototypeOf(Cylinder)).call(this))

    var angleStep = 2 * Math.PI / nDiv

    // Due centri, uno in basso ed uno in alto.
    var centreBottom = [0.0, 0.0, 0.0]
    var centreTop = [0.0, height, 0.0]

    ;(_this3$vertices = _this3.vertices).push.apply(_this3$vertices, centreBottom) // Indice 0
    ;(_this3$colors = _this3.colors).push.apply(_this3$colors, _toConsumableArray(color))

    ;(_this3$vertices2 = _this3.vertices).push.apply(_this3$vertices2, centreTop) // Indice 1
    ;(_this3$colors2 = _this3.colors).push.apply(_this3$colors2, _toConsumableArray(color))

    // Carico dalla posizione 2 ad nDiv + 1 i vertici della circonferenza inferiore.
    for (var i = 0, angle = 0; i < nDiv; i++, angle += angleStep) {
      var _this3$colors3

      var x = Math.cos(angle) * radius
      var z = Math.sin(angle) * radius

      _this3.vertices.push(x, centreBottom[1], z) // i ed è il vertice in basso
      ;(_this3$colors3 = _this3.colors).push.apply(_this3$colors3, _toConsumableArray(color))
    }

    // Carico dalla posizione nDiv + 2 ad 2*nDiv + 1 i vertici della circonferenza superiore
    for (var j = 0, _angle = 0; j < nDiv; j++, _angle += angleStep) {
      var _this3$colors4

      var _x = Math.cos(_angle) * radius
      var _z = Math.sin(_angle) * radius

      _this3.vertices.push(_x, centreTop[1], _z) // i ed è il vertice in basso
      ;(_this3$colors4 = _this3.colors).push.apply(_this3$colors4, _toConsumableArray(color))
    }

    // Itero da 0 a nDiv - 1 per inserire gli indici nel buffer.
    for (var k = 0; k < nDiv; k++) {
      var _i = k + 2 // Indice che scorre i vertici della circonferenza inferiore.
      var _j = _i + nDiv // Indice che scorre i vertici della circonferenza superiore.

      // Se non stiamo considerando gli ultimi vertici sulle circonferenze.
      if (k < nDiv - 1) {
        // Disegnamo le due circonferenze come al solito.
        _this3.indices.push(_i, _i + 1, 0)
        _this3.indices.push(_j, _j + 1, 1)

        // Disegniamo la maglia costruendo quadrati formati da due triangoli.
        /*
         j      j+1
          + - - +
          |     |
          |     |
          + - - +
         i       i+1
        */

        _this3.indices.push(_i, _i + 1, _j)
        _this3.indices.push(_j, _j + 1, _i + 1)
      } else {
        // Come al solito gli ultimi vertici sulle circonferenze vanno uniti coi primi.
        // Il primo vertice della circonferenza inferiore è 2.
        // Il primo vertice della circonferenza superiore è nDiv + 2.
        _this3.indices.push(_i, 2, 0)
        _this3.indices.push(_j, nDiv + 2, 1)

        _this3.indices.push(_i, 2, _j)
        _this3.indices.push(_j, nDiv + 2, 2)
      }
    }

    _this3.cameraPos = new Vector3([0.0, 0.0, 10.0])
    return _this3
  }

  return Cylinder
})(Shape)

var Sphere = (function(_Shape4) {
  _inherits(Sphere, _Shape4)

  function Sphere(nDiv, radius, color) {
    _classCallCheck(this, Sphere)

    // Per disegnare una sfera abbiamo bisogno di nDiv^2 vertici.
    // Il ciclo for più esterno è quello che itera sull'angolo phi, ossia quello che ci fa passare da
    // una circonferenza alla sua consecutiva.
    var _this4 = _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this))

    for (var j = 0; j <= nDiv; j++) {
      // L'angolo phi è compresto tra 0 e Pi
      var phi = j * Math.PI / nDiv

      // Il ciclo for più interno è quello che itera sull'angolo theta, ossia quello che ci fa passare da un vertice
      // al suo successivo sulla stessa circonferenza.
      for (var i = 0; i <= nDiv; i++) {
        var _this4$colors

        // L'angolo theta è compreso tra 0 e 2 * Pi.
        var theta = i * 2 * Math.PI / nDiv

        // Il calcolo delle coordinate di un vertice avviene tramite le equazioni parametriche della sfera.
        var x = radius * Math.cos(phi) * Math.sin(theta)
        var y = radius * Math.sin(phi) * Math.sin(theta)
        var z = radius * Math.cos(theta)

        _this4.vertices.push(x, y, z)
        ;(_this4$colors = _this4.colors).push.apply(_this4$colors, _toConsumableArray(color))
      }
    }

    // Inizializzazione degli indici, il significato dei cicli for è sempre lo stesso.
    for (var _j2 = 0; _j2 < nDiv; _j2++) {
      for (var _i2 = 0; _i2 < nDiv; _i2++) {
        // p1 è un punto su di una circonferenza.
        var p1 = _j2 * (nDiv + 1) + _i2
        // p2 è il punto sulla circonferenza superiore a quella di p1, nella stessa posizione di p1.
        var p2 = p1 + (nDiv + 1)

        // I punti vanno uniti come nel cilindro per formare dei quadrati.
        _this4.indices.push(p1, p2, p1 + 1)
        _this4.indices.push(p1 + 1, p2, p2 + 1)
      }
    }
    return _this4
  }

  return Sphere
})(Shape)

var Torus = (function(_Shape5) {
  _inherits(Torus, _Shape5)

  function Torus(nDiv, radius, radiusInner, color) {
    _classCallCheck(this, Torus)

    // I vertici e gli indici del toro vengono calcolati come per la sfera
    // cambia solamente l'angolo phi che arriva fino a 2 PI
    // e chiaramente le coordinate dei vertici in funzione della
    // formula parametrica del toro

    var _this5 = _possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this))

    for (var j = 0; j <= nDiv; j++) {
      var phi = j * 2 * Math.PI / nDiv

      for (var i = 0; i <= nDiv; i++) {
        var _this5$colors

        var theta = i * 2 * Math.PI / nDiv

        var x = Math.sin(phi) * (radius + radiusInner * Math.cos(theta))
        var y = Math.cos(phi) * (radius + radiusInner * Math.cos(theta))
        var z = Math.sin(theta) * radiusInner

        _this5.vertices.push(x, y, z)
        ;(_this5$colors = _this5.colors).push.apply(_this5$colors, _toConsumableArray(color))
      }
    }

    for (var _j3 = 0; _j3 < nDiv; _j3++) {
      for (var _i3 = 0; _i3 < nDiv; _i3++) {
        var p1 = _j3 * (nDiv + 1) + _i3
        var p2 = p1 + (nDiv + 1)

        _this5.indices.push(p1, p2, p1 + 1)
        _this5.indices.push(p1 + 1, p2, p2 + 1)
      }
    }
    return _this5
  }

  return Torus
})(Shape)

var main = function main() {
  // Retrieve <canvas> element
  var canvas = document.querySelector('canvas#webgl-es2')
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
  var shape = new Cube([255, 0, 0])

  var n = initVertexBuffers(gl, shape)
  if (n < 0) {
    console.log('Failed to set the vertex information')
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

  var vpMatrix = new Matrix4() // View projection matrix

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
  vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

  var currentAngle = 0.0 // Current rotation angle
  var modelMatrix = new Matrix4() // Model matrix
  var mvpMatrix = new Matrix4() // Model view projection matrix

  var shapeOptions = {
    cone: [200, 1, 2],
    cylinder: [100, 1, 2],
    sphere: [100, 1],
    torus: [100, 1, 0.2],

    //*********************************************************************
    // creo una GUI con dat.gui
  }
  var gui = new dat.GUI()
  // checkbox geometry
  var geometria = {
    cube: true,
    cone: false,
    cylinder: false,
    sphere: false,
    torus: false,
    // color selector
  }
  var colore = { color0: [255, 0, 0] }

  gui.addColor(colore, 'color0').onFinishChange(function(value) {
    // aggiorna il valore del colore, normalizzandolo
    colore = {
      color0: value.map(function(col) {
        return parseFloat(col.toFixed(2))
      }),
    }

    for (var geom in geometria) {
      if (geometria[geom] === true) {
        // Aggiorna l'oggetto shape con la figura selezionata,
        // passando i parametri definiti in shapeOptions
        switch (geom) {
          case 'cube':
            shape = new Cube(colore.color0)
            break

          case 'cone':
            shape = new (Function.prototype.bind.apply(
              Cone,
              [null].concat(_toConsumableArray(shapeOptions.cone), [colore.color0])
            ))()
            break

          case 'cylinder':
            shape = new (Function.prototype.bind.apply(
              Cylinder,
              [null].concat(_toConsumableArray(shapeOptions.cylinder), [colore.color0])
            ))()
            break

          case 'sphere':
            shape = new (Function.prototype.bind.apply(
              Sphere,
              [null].concat(_toConsumableArray(shapeOptions.sphere), [colore.color0])
            ))()
            break

          case 'torus':
            shape = new (Function.prototype.bind.apply(
              Torus,
              [null].concat(_toConsumableArray(shapeOptions.torus), [colore.color0])
            ))()
            break

          default:
            shape = new Cube(colore.color0)
            break
        }
      }
    }

    // e re-inizializza i buffers e setta la posizione della camera
    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))
    n = initVertexBuffers(gl, shape)
  })

  gui.add(geometria, 'cube').onFinishChange(function(value) {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = value
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new Cube(colore.color0)

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    var _iteratorNormalCompletion = true
    var _didIteratorError = false
    var _iteratorError = undefined

    try {
      for (
        var _iterator = gui.__controllers[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true
      ) {
        var ctrl = _step.value

        ctrl.updateDisplay()
      }
    } catch (err) {
      _didIteratorError = true
      _iteratorError = err
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return()
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError
        }
      }
    }
  })

  gui.add(geometria, 'cone').onFinishChange(function(value) {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = value
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new (Function.prototype.bind.apply(
      Cone,
      [null].concat(_toConsumableArray(shapeOptions.cone), [colore.color0])
    ))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    var _iteratorNormalCompletion2 = true
    var _didIteratorError2 = false
    var _iteratorError2 = undefined

    try {
      for (
        var _iterator2 = gui.__controllers[Symbol.iterator](), _step2;
        !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
        _iteratorNormalCompletion2 = true
      ) {
        var ctrl = _step2.value

        ctrl.updateDisplay()
      }
    } catch (err) {
      _didIteratorError2 = true
      _iteratorError2 = err
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return()
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2
        }
      }
    }
  })

  gui.add(geometria, 'cylinder').onFinishChange(function(value) {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = value
      geometria.sphere = false
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new (Function.prototype.bind.apply(
      Cylinder,
      [null].concat(_toConsumableArray(shapeOptions.cylinder), [colore.color0])
    ))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    var _iteratorNormalCompletion3 = true
    var _didIteratorError3 = false
    var _iteratorError3 = undefined

    try {
      for (
        var _iterator3 = gui.__controllers[Symbol.iterator](), _step3;
        !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
        _iteratorNormalCompletion3 = true
      ) {
        var ctrl = _step3.value

        ctrl.updateDisplay()
      }
    } catch (err) {
      _didIteratorError3 = true
      _iteratorError3 = err
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return()
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3
        }
      }
    }
  })

  gui.add(geometria, 'sphere').onFinishChange(function(value) {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = value
      geometria.torus = false
    }

    // update shape object and re-init buffers
    shape = new (Function.prototype.bind.apply(
      Sphere,
      [null].concat(_toConsumableArray(shapeOptions.sphere), [colore.color0])
    ))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    var _iteratorNormalCompletion4 = true
    var _didIteratorError4 = false
    var _iteratorError4 = undefined

    try {
      for (
        var _iterator4 = gui.__controllers[Symbol.iterator](), _step4;
        !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done);
        _iteratorNormalCompletion4 = true
      ) {
        var ctrl = _step4.value

        ctrl.updateDisplay()
      }
    } catch (err) {
      _didIteratorError4 = true
      _iteratorError4 = err
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return()
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4
        }
      }
    }
  })

  gui.add(geometria, 'torus').onFinishChange(function(value) {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = value
    }

    // update shape object and re-init buffers
    shape = new (Function.prototype.bind.apply(
      Torus,
      [null].concat(_toConsumableArray(shapeOptions.torus), [colore.color0])
    ))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)

    // Iterate over all controllers
    var _iteratorNormalCompletion5 = true
    var _didIteratorError5 = false
    var _iteratorError5 = undefined

    try {
      for (
        var _iterator5 = gui.__controllers[Symbol.iterator](), _step5;
        !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done);
        _iteratorNormalCompletion5 = true
      ) {
        var ctrl = _step5.value

        ctrl.updateDisplay()
      }
    } catch (err) {
      _didIteratorError5 = true
      _iteratorError5 = err
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return()
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5
        }
      }
    }
  })

  // Forza i checkbox perchè non vengano deselezionati
  // per evitare lo stato in cui nessuno sia selezionato
  document.querySelectorAll('input[type="checkbox"').forEach(function(el) {
    el.onchange = function(e) {
      if (!e.target.checked) {
        e.target.checked = true
      }
    }
  })

  //*********************************************************************************
  var tick = function tick() {
    currentAngle = animate(currentAngle) // Update the rotation angle
    // Calculate the model matrix
    modelMatrix.setRotate(currentAngle, 0, 1, -1) // Rotate around the axis

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

var initVertexBuffers = function initVertexBuffers(gl, shape) {
  var vertices = new Float32Array(shape.vertices)
  var indices = new Uint16Array(shape.indices)
  var colors = new Float32Array(shape.colors)

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1
  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer()
  if (!indexBuffer) {
    console.log('Failed to create the buffer object')
    return false
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return indices.length
}

var initArrayBuffer = function initArrayBuffer(gl, attribute, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer()
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
var ANGLE_STEP = 5.0

// Last time that this function was called
var g_last = Date.now()

var animate = function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now()
  var elapsed = now - g_last
  g_last = now

  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + ANGLE_STEP * elapsed / 200.0
  return (newAngle %= 360)
}

main()
