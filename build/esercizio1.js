'use strict'

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

/*
  Esercitazione 3 - Esercizio 1

  Gruppo:
    - Bulzoni Federico
    - Guerra Antonio
    - Zambello Nicola
*/

// Vertex shader program
var vertexShaderSource =
  '\n  attribute vec4 a_Position;   // Vertex coordinates\n  uniform mat4 u_MvpMatrix;    // Model-View-Projection Matrix\n  attribute vec2 a_TexCoord;\n  varying vec2 v_TexCoord;\n\n  void main() {\n    gl_Position = u_MvpMatrix * a_Position;\n    v_TexCoord = a_TexCoord;\n  }\n'

// Fragment shader program
var fragmentShaderSource =
  '\n  #ifdef GL_ES\n  precision mediump float;\n  #endif\n\n  uniform sampler2D u_Sampler;\n  varying vec2 v_TexCoord;\n\n  void main() {\n    gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n  }\n'

var cross = function cross(edge1, edge2) {
  var n = []

  /* 
   * Nx = UyVz - UzVy
   * Ny = UzVx - UxVz
   * Nz = UxVy - UyVx
   */

  n[0] = edge1[1] * edge2[2] - edge1[2] * edge2[1]
  n[1] = edge1[2] * edge2[0] - edge1[0] * edge2[2]
  n[2] = edge1[0] * edge2[1] - edge1[1] * edge2[0]

  return n
}

var getNormal = function getNormal(v1, v2, v3) {
  var edge1 = []
  edge1[0] = v2[0] - v1[0]
  edge1[1] = v2[1] - v1[1]
  edge1[2] = v2[2] - v1[2]

  var edge2 = []
  edge2[0] = v3[0] - v1[0]
  edge2[1] = v3[1] - v1[1]
  edge2[2] = v3[2] - v1[2]

  return cross(edge1, edge2)
}

var Shape = (function() {
  function Shape() {
    _classCallCheck(this, Shape)

    this.vertices = []
    this.verticesToDraw = []
    this.normals = []
    this.texCoord = []
    // this.indices = []
    this.cameraPos = new Vector3([0.0, 0.0, 6.0])
  }

  _createClass(Shape, [
    {
      key: 'getVertex',
      value: function getVertex(idx) {
        return [this.vertices[3 * idx], this.vertices[3 * idx + 1], this.vertices[3 * idx + 2]]
      },
    },
    {
      key: 'updateNormal',
      value: function updateNormal(idx1, idx2, idx3) {
        var _this = this,
          _normals

        // passati 3 indici di vertici appartenenti ad un triangolo
        var triangle = [this.getVertex(idx1), this.getVertex(idx2), this.getVertex(idx3)]

        // si caricano i tre vertici nel buffer dei vertici da disegnare
        triangle.map(function(v) {
          var _verticesToDraw

          ;(_verticesToDraw = _this.verticesToDraw).push.apply(_verticesToDraw, _toConsumableArray(v))
        })

        // per poi calcolare la normale del triangolo
        var norm = getNormal.apply(undefined, triangle)

        // e si carica la normale per ogni vertice di tale triangolo
        ;(_normals = this.normals).push.apply(
          _normals,
          _toConsumableArray(norm).concat(_toConsumableArray(norm), _toConsumableArray(norm))
        )
      },
    },
  ])

  return Shape
})()

var Cube = (function(_Shape) {
  _inherits(Cube, _Shape)

  function Cube() {
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

    var _this2 = _possibleConstructorReturn(this, (Cube.__proto__ || Object.getPrototypeOf(Cube)).call(this))

    _this2.numberVertices = 8
    // prettier-ignore
    _this2.vertices = [1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
    -1.0, 1.0, -1.0, // v0-v5-v6-v1 up
    -1.0, -1.0, -1.0];

    // Normal
    // prettier-ignore
    /*
    this.normals = [
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ];
    */

    // prettier-ignore
    /*
    this.texCoord = [
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v0-v1-v2-v3 front
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,  // v0-v3-v4-v5 right
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,  // v0-v5-v6-v1 up
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v1-v6-v7-v2 left
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,  // v7-v4-v3-v2 down
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0   // v4-v7-v6-v5 back
    ]
    */

    _this2.updateNormal(0, 1, 2);
    _this2.texCoord.push(1.0, 1.0, 0.0, 1.0, 0.0, 0.0)
    _this2.updateNormal(2, 3, 0)
    _this2.texCoord.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0)

    _this2.updateNormal(0, 3, 4)
    _this2.texCoord.push(0.0, 1.0, 0.0, 0.0, 1.0, 0.0)
    _this2.updateNormal(4, 5, 0)
    _this2.texCoord.push(1.0, 0.0, 1.0, 1.0, 0.0, 1.0)

    _this2.updateNormal(0, 5, 6)
    _this2.texCoord.push(1.0, 0.0, 1.0, 1.0, 0.0, 1.0)
    _this2.updateNormal(6, 1, 0)
    _this2.texCoord.push(0.0, 1.0, 0.0, 0.0, 1.0, 0.0)

    _this2.updateNormal(1, 6, 7)
    _this2.texCoord.push(1.0, 1.0, 0.0, 1.0, 0.0, 0.0)
    _this2.updateNormal(7, 2, 1)
    _this2.texCoord.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0)

    _this2.updateNormal(7, 4, 3)
    _this2.texCoord.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0)
    _this2.updateNormal(3, 2, 7)
    _this2.texCoord.push(1.0, 1.0, 0.0, 1.0, 0.0, 0.0)

    _this2.updateNormal(4, 7, 6)
    //this.texCoord.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0)
    _this2.texCoord.push(1.0, 1.0, 0.0, 1.0, 0.0, 0.0)
    _this2.updateNormal(6, 5, 4)
    //this.texCoord.push(1.0, 1.0, 0.0, 1.0, 0.0, 0.0)
    _this2.texCoord.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0)

    _this2.cameraPos = new Vector3([0.0, 0.0, 7.0])
    return _this2
  }

  return Cube
})(Shape)

var Cone = (function(_Shape2) {
  _inherits(Cone, _Shape2)

  function Cone(nDiv, radius, height) {
    var _this3$vertices, _this3$vertices2

    _classCallCheck(this, Cone)

    var _this3 = _possibleConstructorReturn(this, (Cone.__proto__ || Object.getPrototypeOf(Cone)).call(this))

    var numberVertices = nDiv + 2
    var angleStep = 2 * Math.PI / nDiv
    var centre = [0.0, 0.0, 0.0]
    var top = [0.0, height, 0.0]

    ;(_this3$vertices = _this3.vertices).push.apply(_this3$vertices, centre)
    ;(_this3$vertices2 = _this3.vertices).push.apply(_this3$vertices2, top)

    // genero tutti i vertici
    for (var i = 2; i < numberVertices; i++) {
      var angle = i * angleStep
      var x = Math.cos(angle) * radius
      var z = Math.sin(angle) * radius
      var y = centre[1]

      _this3.vertices.push(x, y, z)
    }

    // generiamo tutto.
    for (var _i = 2; _i < numberVertices; _i++) {
      var angleITex = _i * angleStep / (2 * Math.PI)

      if (_i < numberVertices - 1) {
        // Collego il vertice al suo precedente e al top.
        _this3.updateNormal(_i + 1, _i, 1)
        _this3.texCoord.push(angleITex * angleStep, 0.0, angleITex, 0.0, angleITex, 1.0)
        // Collego il vertice al suo successivo e al centro basso.
        _this3.updateNormal(_i, _i + 1, 0)
        _this3.texCoord.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
      } else {
        // Nel caso sia l'ultimo vertice allora lo collego col primo sulla circonferenza.
        _this3.updateNormal(2, _i, 1)
        _this3.texCoord.push(angleStep / (2 * Math.PI), 0.0, angleITex, 0.0, angleITex, 1.0)
        _this3.updateNormal(_i, 2, 0)
        _this3.texCoord.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
      }
    }
    _this3.cameraPos = new Vector3([0.0, 0.0, 8.0])
    return _this3
  }

  return Cone
})(Shape)

var Cylinder = (function(_Shape3) {
  _inherits(Cylinder, _Shape3)

  function Cylinder(nDiv, radius, height) {
    var _this4$vertices, _this4$vertices2

    _classCallCheck(this, Cylinder)

    var _this4 = _possibleConstructorReturn(this, (Cylinder.__proto__ || Object.getPrototypeOf(Cylinder)).call(this))

    var angleStep = 2 * Math.PI / nDiv

    // Due centri, uno in basso ed uno in alto.
    var centreBottom = [0.0, 0.0, 0.0]
    var centreTop = [0.0, height, 0.0]

    ;(_this4$vertices = _this4.vertices).push.apply(_this4$vertices, centreBottom) // Indice 0
    _this4.texCoord.push(0.5, 0.0)

    ;(_this4$vertices2 = _this4.vertices).push.apply(_this4$vertices2, centreTop) // Indice 1
    _this4.texCoord.push(0.5, 1.0)

    // Carico dalla posizione 2 ad nDiv + 1 i vertici della circonferenza inferiore.
    for (var i = 0, angle = 0; i < nDiv; i++, angle += angleStep) {
      var x = Math.cos(angle) * radius
      var z = Math.sin(angle) * radius

      var u = -angle / (2 * Math.PI)
      var v = 0.0

      _this4.vertices.push(x, centreBottom[1], z) // i ed è il vertice in basso
      _this4.texCoord.push(u, v)
    }

    // Carico dalla posizione nDiv + 2 ad 2*nDiv + 1 i vertici della circonferenza superiore
    for (var j = 0, _angle = 0; j < nDiv; j++, _angle += angleStep) {
      var _x = Math.cos(_angle) * radius
      var _z = Math.sin(_angle) * radius

      var _u = -_angle / (2 * Math.PI)
      var _v = 1.0

      _this4.vertices.push(_x, centreTop[1], _z) // i ed è il vertice in basso
      _this4.texCoord.push(_u, _v)
    }

    // Itero da 0 a nDiv - 1 per inserire gli indici nel buffer.
    for (var k = 0; k < nDiv; k++) {
      var _i2 = k + 2 // Indice che scorre i vertici della circonferenza inferiore.
      var _j = _i2 + nDiv // Indice che scorre i vertici della circonferenza superiore.

      // Se non stiamo considerando gli ultimi vertici sulle circonferenze.
      if (k < nDiv - 1) {
        // Disegnamo le due circonferenze come al solito.
        _this4.indices.push(_i2, _i2 + 1, 0)
        _this4.indices.push(_j, _j + 1, 1)

        // Disegniamo la maglia costruendo quadrati formati da due triangoli.
        /*
         j      j+1
          + - - +
          |     |
          |     |
          + - - +
         i       i+1
        */

        _this4.indices.push(_i2, _i2 + 1, _j)
        _this4.indices.push(_j, _j + 1, _i2 + 1)
      } else {
        // Come al solito gli ultimi vertici sulle circonferenze vanno uniti coi primi.
        // Il primo vertice della circonferenza inferiore è 2.
        // Il primo vertice della circonferenza superiore è nDiv + 2.
        _this4.indices.push(_i2, 2, 0)
        _this4.indices.push(_j, nDiv + 2, 1)

        _this4.indices.push(_i2, 2, _j)
        _this4.indices.push(_j, nDiv + 2, 2)
      }
    }

    _this4.cameraPos = new Vector3([0.0, 0.0, 10.0])
    return _this4
  }

  return Cylinder
})(Shape)

var Sphere = (function(_Shape4) {
  _inherits(Sphere, _Shape4)

  _createClass(Sphere, [
    {
      key: 'getTexCoord',
      value: function getTexCoord(idx) {
        return [this.texSuppo[2 * idx], this.texSuppo[2 * idx + 1]]
      },
    },
  ])

  function Sphere(nDiv, radius) {
    _classCallCheck(this, Sphere)

    var _this5 = _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this))

    _this5.texSuppo = []
    // Per disegnare una sfera abbiamo bisogno di nDiv^2 vertici.
    // Il ciclo for più esterno è quello che itera sull'angolo phi, ossia quello che ci fa passare da
    // una circonferenza alla sua consecutiva.
    for (var j = 0; j <= nDiv; j++) {
      // L'angolo phi è compresto tra 0 e Pi
      var phi = j * Math.PI / nDiv

      // Il ciclo for più interno è quello che itera sull'angolo theta, ossia quello che ci fa passare da un vertice
      // al suo successivo sulla stessa circonferenza.
      for (var i = 0; i <= nDiv; i++) {
        // L'angolo theta è compreso tra 0 e 2 * Pi.
        var theta = i * 2 * Math.PI / nDiv

        // Il calcolo delle coordinate di un vertice avviene tramite le equazioni parametriche della sfera.
        var x = Math.sin(theta) * Math.sin(phi)
        var y = Math.cos(phi)
        var z = Math.cos(theta) * Math.sin(phi)

        _this5.vertices.push(radius * x, radius * y, radius * z)

        var u = theta / (2 * Math.PI)
        var v = 1 - phi / Math.PI
        _this5.texSuppo.push(u, v)
      }
    }

    // Inizializzazione degli indici, il significato dei cicli for è sempre lo stesso.
    for (var _j2 = 0; _j2 < nDiv; _j2++) {
      for (var _i3 = 0; _i3 < nDiv; _i3++) {
        // p1 è un punto su di una circonferenza.
        var p1 = _j2 * (nDiv + 1) + _i3
        // p2 è il punto sulla circonferenza superiore a quella di p1, nella stessa posizione di p1.
        var p2 = p1 + (nDiv + 1)

        // I punti vanno uniti come nel cilindro per formare dei quadrati.
        var triangle0 = [p1 + 1, p1, p2]
        _this5.updateNormal.apply(_this5, triangle0)

        triangle0.map(function(el) {
          var _this5$texCoord

          ;(_this5$texCoord = _this5.texCoord).push.apply(_this5$texCoord, _toConsumableArray(_this5.getTexCoord(el)))
        })

        var triangle1 = [p2, p2 + 1, p1 + 1]
        _this5.updateNormal.apply(_this5, triangle1)
        triangle1.map(function(el) {
          var _this5$texCoord2

          ;(_this5$texCoord2 = _this5.texCoord).push.apply(_this5$texCoord2, _toConsumableArray(_this5.getTexCoord(el)))
        })
      }
    }
    return _this5
  }

  return Sphere
})(Shape)

var Torus = (function(_Shape5) {
  _inherits(Torus, _Shape5)

  _createClass(Torus, [
    {
      key: 'getTexCoord',
      value: function getTexCoord(idx) {
        return [this.texSuppo[2 * idx], this.texSuppo[2 * idx + 1]]
      },
    },
  ])

  function Torus(nDiv, radius, radiusInner) {
    _classCallCheck(this, Torus)

    var _this6 = _possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this))

    _this6.texSuppo = []
    // I vertici e gli indici del toro vengono calcolati come per la sfera
    // cambia solamente l'angolo phi che arriva fino a 2 PI
    // e chiaramente le coordinate dei vertici in funzione della
    // formula parametrica del toro

    for (var j = 0; j <= nDiv; j++) {
      var phi = j * 2 * Math.PI / nDiv

      for (var i = 0; i <= nDiv; i++) {
        var theta = i * 2 * Math.PI / nDiv

        var x = Math.cos(phi) * (radius + radiusInner * Math.cos(theta))
        var y = Math.sin(phi) * (radius + radiusInner * Math.cos(theta))
        var z = Math.sin(theta) * radiusInner

        var u = phi / (2 * Math.PI)
        var v = theta / (2 * Math.PI)

        _this6.vertices.push(x, y, z)
        _this6.texSuppo.push(u, v)
      }
    }

    for (var _j3 = 0; _j3 < nDiv; _j3++) {
      for (var _i4 = 0; _i4 < nDiv; _i4++) {
        var p1 = _j3 * (nDiv + 1) + _i4
        var p2 = p1 + (nDiv + 1)

        var triangle0 = [p1 + 1, p1, p2]
        _this6.updateNormal.apply(_this6, triangle0)

        triangle0.map(function(el) {
          var _this6$texCoord

          ;(_this6$texCoord = _this6.texCoord).push.apply(_this6$texCoord, _toConsumableArray(_this6.getTexCoord(el)))
        })

        var triangle1 = [p2, p2 + 1, p1 + 1]
        _this6.updateNormal.apply(_this6, triangle1)
        triangle1.map(function(el) {
          var _this6$texCoord2

          ;(_this6$texCoord2 = _this6.texCoord).push.apply(_this6$texCoord2, _toConsumableArray(_this6.getTexCoord(el)))
        })
      }
    }
    return _this6
  }

  return Torus
})(Shape)

var main = function main() {
  // Retrieve <canvas> element
  var canvas = document.querySelector('canvas#webgl-es3')
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

  var vpMatrix = new Matrix4() // View projection matrix

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
  vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

  var currentAngle = 0.0 // Current rotation angle
  var modelMatrix = new Matrix4() // Model matrix
  var mvpMatrix = new Matrix4() // Model view projection matrix

  var shapeOptions = {
    cone: [100, 1, 2],
    cylinder: [100, 1, 2],
    sphere: [100, 1],
    torus: [100, 1, 0.4],

    //*********************************************************************
    // creo una GUI con dat.gui
  }
  var gui = new dat.GUI()
  // checkbox geometry
  var geometria = { cube: true, cone: false, cylinder: false, sphere: false, torus: false }

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
    shape = new Cube()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)
    console.log('%cShape: %cCube', 'font-weight: 600', 'font-weight: 400')

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
    shape = new (Function.prototype.bind.apply(Cone, [null].concat(_toConsumableArray(shapeOptions.cone))))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)
    console.log('%cShape: %cCone', 'font-weight: 600', 'font-weight: 400')

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
    shape = new (Function.prototype.bind.apply(Cylinder, [null].concat(_toConsumableArray(shapeOptions.cylinder))))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)
    console.log('%cShape: %cCylinder', 'font-weight: 600', 'font-weight: 400')

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
    shape = new (Function.prototype.bind.apply(Sphere, [null].concat(_toConsumableArray(shapeOptions.sphere))))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)
    console.log('%cShape: %cSphere', 'font-weight: 600', 'font-weight: 400')

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
    shape = new (Function.prototype.bind.apply(Torus, [null].concat(_toConsumableArray(shapeOptions.torus))))()

    vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
    vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

    n = initVertexBuffers(gl, shape)
    console.log('%cShape: %cTorus', 'font-weight: 600', 'font-weight: 400')

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
    modelMatrix.setRotate(currentAngle, 1, 0, 0) // Rotate around the axis

    mvpMatrix.set(vpMatrix).multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Draw the cube
    gl.drawArrays(gl.TRIANGLES, 0, n)

    requestAnimationFrame(tick, canvas) // Request that the browser calls tick
  }
  tick()
}

var initVertexBuffers = function initVertexBuffers(gl, shape) {
  var verticesToDraw = new Float32Array(shape.verticesToDraw)
  //const indices = new Uint16Array(shape.indices)
  var texCoord = new Float32Array(shape.texCoord)

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', verticesToDraw, gl.FLOAT, 3)) return -1
  if (!initArrayBuffer(gl, 'a_TexCoord', texCoord, gl.FLOAT, 2)) return -1

  /*
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
  */

  return verticesToDraw.length / 3
}

var initArrayBuffer = function initArrayBuffer(gl, attribute, data, type, num) {
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

  // TODO: Ci vuole l'unbinding? Ciao Anto.
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

var initTextures = function initTextures(gl) {
  var texture = gl.createTexture() // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object')
    return false
  }

  // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')
  if (!u_Sampler) {
    console.log('Failed to create the Sampler object')
    return false
  }

  var image = new Image() // Create the image object
  if (!image) {
    console.log('Failed to create the image object')
    return false
  }

  // Register the event handler to be called on loading an image
  image.onload = function() {
    loadTexture(gl, texture, u_Sampler, image)
  }

  // Tell the browser to load an image
  image.src = getImageURL()

  // Update texture on radio-button change
  document.querySelector('.radio-component').onchange = function(e) {
    image.src = getImageURL()
    console.log('%cTexture: %c' + image.src, 'font-weight: 600', 'font-weight: 400')
  }

  return true
}

var getImageURL = function getImageURL() {
  var baseURL = './textures'
  var imgName = 'ash_uvgrid01'

  if (document.querySelector('input[name="texture-image"]:checked')) {
    imgName = document.querySelector('input[name="texture-image"]:checked').value
  }

  return baseURL + '/' + imgName + '.jpg'
}

var loadTexture = function loadTexture(gl, texture, u_Sampler, image) {
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
