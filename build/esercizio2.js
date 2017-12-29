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
  Esercitazione 3 - Esercizio 2

  Gruppo:
    - Bulzoni Federico
    - Guerra Antonio
    - Zambello Nicola
*/

// Vertex shader program
var vertexShaderSource =
  '\n  attribute vec4 a_Position;   // Vertex coordinates\n  attribute vec4 a_Normal;     // Vertex normal.\n  uniform mat4 u_MvpMatrix;    // Model-View-Projection Matrix\n  uniform mat4 u_ModelMatrix;\n  uniform mat4 u_NormalMatrix;\n\n  attribute vec2 a_TexCoord;\n\n  varying vec3 v_vertexPosition;\n  varying vec3 v_normal;\n\n  varying vec2 v_TexCoord;\n\n  void main() {\n    gl_Position = u_MvpMatrix * a_Position;\n\n    v_normal = normalize(vec3(u_NormalMatrix * a_Normal));\n    v_vertexPosition = vec3(u_ModelMatrix * a_Position);\n\n    v_TexCoord = a_TexCoord;\n  }\n'

// Fragment shader program
var fragmentShaderSource =
  '\n  #ifdef GL_ES\n  precision mediump float;\n  #endif\n  \n  varying vec3 v_vertexPosition;\n  varying vec3 v_normal;\n\n  uniform vec3 u_LightPosition;\n  uniform vec3 u_LightColor;\n\n  uniform sampler2D u_Sampler;\n  varying vec2 v_TexCoord;\n\n  void main() {\n    float d = length(u_LightPosition - v_vertexPosition);\n    float atten = 1.0 / (0.01 * d * d);\n\n    vec3 lightDirection = normalize(u_LightPosition - v_vertexPosition);\n    float nDotL = max(dot(lightDirection, v_normal), 0.0);\n\n    vec3 diffuse = u_LightColor * vec3(texture2D(u_Sampler, v_TexCoord)) * nDotL;\n    gl_FragColor = vec4(atten * diffuse, 1.0);\n  }\n'

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
      key: 'updateVerticesToDraw',
      value: function updateVerticesToDraw(triangle) {
        var _this = this

        // si caricano i tre vertici nel buffer dei vertici da disegnare
        triangle.map(function(v) {
          var _verticesToDraw

          ;(_verticesToDraw = _this.verticesToDraw).push.apply(_verticesToDraw, _toConsumableArray(v))
        })
      },
    },
    {
      key: 'updateNormal',
      value: function updateNormal(triangle) {
        var _normals

        // per poi calcolare la normale del triangolo
        var norm = getNormal.apply(undefined, _toConsumableArray(triangle))

        // e si carica la normale per ogni vertice di tale triangolo
        ;(_normals = this.normals).push.apply(
          _normals,
          _toConsumableArray(norm).concat(_toConsumableArray(norm), _toConsumableArray(norm))
        )
      },
    },
    {
      key: 'loadTriangle',
      value: function loadTriangle(idx1, idx2, idx3, texCoord1, texCoord2, texCoord3) {
        var _this2 = this,
          _texCoord

        var triangle = [idx1, idx2, idx3].map(function(idx) {
          return _this2.getVertex(idx)
        })

        // Dobbiamo caricare i vertici nel buffer da disegnare.
        this.updateVerticesToDraw(triangle)

        // Caricare le normali.
        this.updateNormal(triangle)

        // Caricare le texture.
        ;(_texCoord = this.texCoord).push.apply(
          _texCoord,
          _toConsumableArray(texCoord1).concat(_toConsumableArray(texCoord2), _toConsumableArray(texCoord3))
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

    // prettier-ignore
    var _this3 = _possibleConstructorReturn(this, (Cube.__proto__ || Object.getPrototypeOf(Cube)).call(this));

    _this3.vertices = [
      1.0,
      1.0,
      1.0, // 0
      -1.0,
      1.0,
      1.0, // 1
      -1.0,
      -1.0,
      1.0, // 2
      1.0,
      -1.0,
      1.0, // 3
      1.0,
      -1.0,
      -1.0, // 4
      1.0,
      1.0,
      -1.0, // 5
      -1.0,
      1.0,
      -1.0, // 6
      -1.0,
      -1.0,
      -1.0,
    ]

    _this3.loadTriangle(0, 1, 2, [1.0, 1.0], [0.0, 1.0], [0.0, 0.0])
    _this3.loadTriangle(2, 3, 0, [0.0, 0.0], [1.0, 0.0], [1.0, 1.0])

    _this3.loadTriangle(0, 3, 4, [0.0, 1.0], [0.0, 0.0], [1.0, 0.0])
    _this3.loadTriangle(4, 5, 0, [1.0, 0.0], [1.0, 1.0], [0.0, 1.0])

    _this3.loadTriangle(0, 5, 6, [1.0, 0.0], [1.0, 1.0], [0.0, 1.0])
    _this3.loadTriangle(6, 1, 0, [0.0, 1.0], [0.0, 0.0], [1.0, 0.0])

    _this3.loadTriangle(1, 6, 7, [1.0, 1.0], [0.0, 1.0], [0.0, 0.0])
    _this3.loadTriangle(7, 2, 1, [0.0, 0.0], [1.0, 0.0], [1.0, 1.0])

    _this3.loadTriangle(7, 4, 3, [0.0, 0.0], [1.0, 0.0], [1.0, 1.0])
    _this3.loadTriangle(3, 2, 7, [1.0, 1.0], [0.0, 1.0], [0.0, 0.0])

    _this3.loadTriangle(4, 7, 6, [1.0, 1.0], [0.0, 1.0], [0.0, 0.0])
    _this3.loadTriangle(6, 5, 4, [0.0, 0.0], [1.0, 0.0], [1.0, 1.0])

    _this3.cameraPos = new Vector3([0.0, 0.0, 7.0])
    return _this3
  }

  return Cube
})(Shape)

var Cone = (function(_Shape2) {
  _inherits(Cone, _Shape2)

  function Cone(nDiv, radius, height) {
    var _this4$vertices, _this4$vertices2

    _classCallCheck(this, Cone)

    var _this4 = _possibleConstructorReturn(this, (Cone.__proto__ || Object.getPrototypeOf(Cone)).call(this))

    var numberVertices = nDiv + 2
    var angleStep = 2 * Math.PI / nDiv
    var centre = [0.0, 0.0, 0.0]
    var top = [0.0, height, 0.0]

    ;(_this4$vertices = _this4.vertices).push.apply(_this4$vertices, centre)
    ;(_this4$vertices2 = _this4.vertices).push.apply(_this4$vertices2, top)

    // genero tutti i vertici
    for (var k = 0; k < nDiv; k++) {
      var angle = k * angleStep
      var x = Math.cos(angle) * radius
      var z = Math.sin(angle) * radius
      var y = centre[1]

      _this4.vertices.push(x, y, z)
    }

    // Incomincio caricando la base.
    for (var _k = 0; _k < nDiv; _k++) {
      var i = _k + 2
      var uvi = [0.5 + 1 / 2 * Math.cos(angleStep * _k), 0.5 + 1 / 2 * Math.sin(angleStep * _k)]
      var uv0 = [0.5, 0.5]

      if (_k != nDiv - 1) {
        var uviplus1 = [0.5 + 1 / 2 * Math.cos(angleStep * (_k + 1)), 0.5 + 1 / 2 * Math.sin(angleStep * (_k + 1))]

        _this4.loadTriangle(i, i + 1, 0, uvi, uviplus1, uv0)
      } else {
        var uv2 = [0.5 + 1 / 2 * Math.cos(0.0), 0.5 + 1 / 2 * Math.sin(0.0)]

        _this4.loadTriangle(i, 2, 0, uvi, uv2, uv0)
      }
    }

    // Ora carico la parte verticale.
    for (var _k2 = 0; _k2 < nDiv; _k2++) {
      var _i = _k2 + 2
      // Coordinate u e v dei vertici della base.
      var _uvi = [-angleStep * _k2 / (2 * Math.PI), 0.0]
      // Mentre verticalmente sarà:
      var uv1 = [_uvi[0], 1.0]
      // E quello di i+1 sarà:
      if (_k2 != nDiv - 1) {
        var _uviplus = [-angleStep * (_k2 + 1) / (2 * Math.PI), 0.0]

        _this4.loadTriangle(_i + 1, _i, 1, _uviplus, _uvi, uv1)
      } else {
        var _uv = [-1.0, 0.0]

        _this4.loadTriangle(2, _i, 1, _uv, _uvi, uv1)
      }
    }
    return _this4
  }

  return Cone
})(Shape)

var Cylinder = (function(_Shape3) {
  _inherits(Cylinder, _Shape3)

  function Cylinder(nDiv, radius, height) {
    var _this5$vertices, _this5$vertices2

    _classCallCheck(this, Cylinder)

    var _this5 = _possibleConstructorReturn(this, (Cylinder.__proto__ || Object.getPrototypeOf(Cylinder)).call(this))

    var angleStep = 2 * Math.PI / nDiv

    // Due centri, uno in basso ed uno in alto.
    var centreBottom = [0.0, 0.0, 0.0]
    var centreTop = [0.0, height, 0.0]

    ;(_this5$vertices = _this5.vertices).push.apply(_this5$vertices, centreBottom) // Indice 0
    ;(_this5$vertices2 = _this5.vertices).push.apply(_this5$vertices2, centreTop) // Indice 1

    // Carico dalla posizione 2 ad nDiv + 1 i vertici della circonferenza inferiore.
    for (var i = 0, angle = 0; i < nDiv; i++, angle += angleStep) {
      var x = Math.cos(angle) * radius
      var z = Math.sin(angle) * radius

      _this5.vertices.push(x, centreBottom[1], z) // i ed è il vertice in basso
    }

    // Carico dalla posizione nDiv + 2 ad 2*nDiv + 1 i vertici della circonferenza superiore
    for (var j = 0, _angle = 0; j < nDiv; j++, _angle += angleStep) {
      var _x = Math.cos(_angle) * radius
      var _z = Math.sin(_angle) * radius

      _this5.vertices.push(_x, centreTop[1], _z) // i ed è il vertice in basso
    }

    // Innanzitutto disegno come prima cosa, le due basi.
    for (var k = 0; k < nDiv; k++) {
      var _i2 = k + 2 // Indice che scorre i vertici della circonferenza inferiore.
      var _j = _i2 + nDiv // Indice che scorre i vertici della circonferenza superiore.

      // Le coordinate uv sono uguali nelle due circonferenze.
      var uvij = [0.5 + 1 / 2 * Math.cos(angleStep * k), 0.5 + 1 / 2 * Math.sin(angleStep * k)]
      var uv01 = [0.5, 0.5]

      if (k != nDiv - 1) {
        var uvijplus1 = [0.5 + 1 / 2 * Math.cos(angleStep * (k + 1)), 0.5 + 1 / 2 * Math.sin(angleStep * (k + 1))]

        _this5.loadTriangle(_i2, _i2 + 1, 0, uvij, uvijplus1, uv01)
        _this5.loadTriangle(_j, _j + 1, 1, uvij, uvijplus1, uv01)
      } else {
        var uv2 = [0.5 + 1 / 2 * Math.cos(0.0), 0.5 + 1 / 2 * Math.sin(0.0)]

        _this5.loadTriangle(_i2, 2, 0, uvij, uv2, uv01)
        _this5.loadTriangle(_j, nDiv + 2, 1, uvij, uv2, uv01)
      }
    }

    // E poi disegno la parte verticale.
    for (var _k3 = 0; _k3 < nDiv; _k3++) {
      var _i3 = _k3 + 2 // Indice che scorre i vertici della circonferenza inferiore.
      var _j2 = _i3 + nDiv // Indice che scorre i vertici della circonferenza superiore.

      var uvi = [-angleStep * _k3 / (2 * Math.PI), 0.0]
      var uvj = [uvi[0], 1.0]

      if (_k3 != nDiv - 1) {
        var uviplus1 = [-angleStep * (_k3 + 1) / (2 * Math.PI), 0.0]
        var uvjplus1 = [uviplus1[0], 1.0]

        _this5.loadTriangle(_i3, _i3 + 1, _j2, uvi, uviplus1, uvj)
        _this5.loadTriangle(_j2, _j2 + 1, _i3 + 1, uvj, uvjplus1, uviplus1)
      } else {
        var _uv2 = [-1.0, 0.0]
        var uv2j = [-1.0, 1.0]

        _this5.loadTriangle(_i3, 2, _j2, uvi, _uv2, uvj)
        _this5.loadTriangle(_j2, nDiv + 2, 2, uvj, uv2j, _uv2)
      }
    }

    _this5.cameraPos = new Vector3([0.0, 0.0, 10.0])
    return _this5
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

    var _this6 = _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this))

    _this6.texSuppo = []
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

        _this6.vertices.push(radius * x, radius * y, radius * z)

        var u = theta / (2 * Math.PI)
        var v = 1 - phi / Math.PI
        _this6.texSuppo.push(u, v)
      }
    }

    // Inizializzazione degli indici, il significato dei cicli for è sempre lo stesso.
    for (var _j3 = 0; _j3 < nDiv; _j3++) {
      for (var _i4 = 0; _i4 < nDiv; _i4++) {
        // p1 è un punto su di una circonferenza.
        var p1 = _j3 * (nDiv + 1) + _i4
        // p2 è il punto sulla circonferenza superiore a quella di p1, nella stessa posizione di p1.
        var p2 = p1 + (nDiv + 1)

        // I punti vanno uniti come nel cilindro per formare dei quadrati.
        _this6.loadTriangle(p1 + 1, p1, p2, _this6.getTexCoord(p1 + 1), _this6.getTexCoord(p1), _this6.getTexCoord(p2))
        _this6.loadTriangle(
          p2,
          p2 + 1,
          p1 + 1,
          _this6.getTexCoord(p2),
          _this6.getTexCoord(p2 + 1),
          _this6.getTexCoord(p1 + 1)
        )
      }
    }
    return _this6
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

    var _this7 = _possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this))

    _this7.texSuppo = []
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

        _this7.vertices.push(x, y, z)
        _this7.texSuppo.push(u, v)
      }
    }

    for (var _j4 = 0; _j4 < nDiv; _j4++) {
      for (var _i5 = 0; _i5 < nDiv; _i5++) {
        var p1 = _j4 * (nDiv + 1) + _i5
        var p2 = p1 + (nDiv + 1)

        _this7.loadTriangle(p1 + 1, p1, p2, _this7.getTexCoord(p1 + 1), _this7.getTexCoord(p1), _this7.getTexCoord(p2))
        _this7.loadTriangle(
          p2,
          p2 + 1,
          p1 + 1,
          _this7.getTexCoord(p2),
          _this7.getTexCoord(p2 + 1),
          _this7.getTexCoord(p1 + 1)
        )
      }
    }
    return _this7
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
  var shape = new Cube()

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
  gl.clearColor(0.5, 0.5, 0.5, 1)
  gl.enable(gl.DEPTH_TEST)

  // Get the storage locations of uniform variables and so on
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition')
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor')
  if (!u_MvpMatrix || !u_ModelMatrix || !u_NormalMatrix || !u_LightPosition || !u_LightColor) {
    console.log('Failed to get the storage location')
    return
  }

  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0)
  gl.uniform3f(u_LightPosition, 10.0, 2.0, 12.0)

  var vpMatrix = new Matrix4() // View projection matrix

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
  vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(shape.cameraPos.elements).concat([0, 0, 0, 0, 1, 0]))

  var currentAngle = 0.0 // Current rotation angle
  var modelMatrix = new Matrix4() // Model matrix
  var mvpMatrix = new Matrix4() // Model view projection matrix
  var normalMatrix = new Matrix4() // Transformation matrix for normals

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
    modelMatrix.setRotate(currentAngle, 0, 1, 1) // Rotate around the axis
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

    mvpMatrix.set(vpMatrix).multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    normalMatrix.setInverseOf(modelMatrix)
    normalMatrix.transpose()
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)

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
  var texCoord = new Float32Array(shape.texCoord)

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', verticesToDraw, gl.FLOAT, 3)) return -1
  if (!initArrayBuffer(gl, 'a_TexCoord', texCoord, gl.FLOAT, 2)) return -1

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

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

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
