'use strict'

/*
  Esercitazione 1 - Esercizio 1

  Gruppo:
    - Bulzoni Federico
    - Guerra Antonio
    - Zambello Nicola

*/

var vertexShaderSource =
  '\n  attribute vec4 a_Position;\n  attribute vec4 a_Color;\n  varying vec4 v_Color;\n  void main() {\n    gl_Position = a_Position;\n    v_Color = a_Color;\n  }\n'

var fragmentShaderSource =
  '\n  precision mediump float;\n  varying vec4 v_Color;\n  void main() {\n    gl_FragColor = v_Color;\n  }\n'

var canvas = document.querySelector('canvas#webgl-es1')
var height = window.innerHeight
var width = window.innerWidth

var rects = []
var clickBuff = []

var a_Position = void 0
var a_Color = void 0

var addClickToRects = function addClickToRects() {
  // se ci sono 2 o più click nel array dei click,
  // preleva due click e, calcolando le coordinate dei quattro vertici
  // e le quattro componenti del colore, aggiunge il nuovo rettangolo
  // all'array dei rettangoli

  if (clickBuff.length && clickBuff.length % 2 === 0) {
    var click1 = clickBuff.pop()
    var click2 = clickBuff.pop()

    var colorR = ((click1.color & 0xff0000) >> 16) / 256
    var colorG = ((click1.color & 0x00ff00) >> 8) / 256
    var colorB = (click1.color & 0x0000ff) / 256
    var colorA = 1.0

    var color = [colorR, colorG, colorB, colorA]

    var rect = [click1.x, click1.y].concat(
      color,
      [click2.x, click2.y],
      color,
      [click1.x, click2.y],
      color,
      [click1.x, click1.y],
      color,
      [click2.x, click2.y],
      color,
      [click2.x, click1.y],
      color
    )

    rects.push(rect)

    return true
  }

  return false
}

var toggleWaitingSecondClick = function toggleWaitingSecondClick() {
  // cambia il cursore in base allo stato:
  // se l'utente ha aggiunto il primo click,
  // setta il cursore a croce per dare feedback
  // altrimenti lo resetta

  var body = document.querySelector('body')
  if (clickBuff.length) {
    body.setAttribute('style', 'cursor: crosshair')
  } else {
    body.removeAttribute('style')
  }
}

canvas.addEventListener('click', function(e) {
  // aggiunge un click all'array
  clickBuff.push({
    x: 2 * e.clientX / width - 1,
    y: -2 * e.clientY / height + 1,
    color: parseInt('0x' + document.querySelector('input#color-input').value.substr(1)),
  })

  // chiama la funzione che gestisce l'array dei rettangoli
  if (addClickToRects(clickBuff, rects)) {
    // se ha aggiunto un rettangolo, ri-disegna tutto
    draw()
  }

  // chiama la funzione che gestisce il cursore in base allo stato
  toggleWaitingSecondClick()
})

document.addEventListener('keydown', function(e) {
  // se è stato premuto il tasto z con il modificatore Ctrl,
  // ed è stato aggiunto solo il primo dei due click,
  // allora viene rimosso un click dall’array dei click,
  // altrimenti viene rimosso un rettangolo dall’array dei rettangoli

  if (e.ctrlKey && e.code == 'KeyZ') {
    if (clickBuff.length > 0) {
      clickBuff.pop()
    } else if (rects.length > 0) {
      rects.pop()
      draw()
    }

    // chiama la funzione che gestisce il cursore in base allo stato
    toggleWaitingSecondClick()
  }
})

var init = function init(canvas, height, width) {
  canvas.width = width
  canvas.height = height

  // inizializza la canvas per il contesto WebGL
  var gl = getWebGLContext(canvas)
  if (!gl) return

  // inizializza gli shaders
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) return

  a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  a_Color = gl.getAttribLocation(gl.program, 'a_Color')

  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  return gl
}

var draw = function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT)

  // crea n buffer in cui vengono salvati i valori
  // dei singoli rettangoli per disegnarli con drawArrays
  var _iteratorNormalCompletion = true
  var _didIteratorError = false
  var _iteratorError = undefined

  try {
    for (
      var _iterator = rects[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var rect = _step.value

      var buffer = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect), gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 6 * 4, 0)
      gl.enableVertexAttribArray(a_Position)
      gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 6 * 4, 2 * 4)
      gl.enableVertexAttribArray(a_Color)
      gl.drawArrays(gl.TRIANGLES, 0, rect.length / 6)
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
}

var gl = init(canvas, height, width)
