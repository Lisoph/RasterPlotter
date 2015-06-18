(function() {
  "use strict";

  var Expressions = {
    r: "",
    g: "",
    b: ""
  };

  var RunChecked = true;

  var Canvas;
  var Context;
  var ImageData;

  // Expression variables
  var t = 0.0;
  var x = 0.0;
  var y = 0.0;
  var cos = Math.cos;
  var sin = Math.sin;
  var tan = Math.tan;
  var abs = Math.abs;
  var min = Math.min;
  var max = Math.max;
  var sqrt = Math.sqrt;
  var pow = Math.pow;
  var Pi = Math.PI;

  function RegisterEvents() {
    // Width and height inputs
    document.getElementById("in-width").addEventListener("input", ResizeCanvas);
    document.getElementById("in-height").addEventListener("input", ResizeCanvas);
    document.getElementById("in-run").addEventListener("click", function() {
      RunChecked = this.checked;
      if(RunChecked) {
        window.requestAnimationFrame(DrawCanvas);
      }
    });

    // Expression inputs
    var in_r_expr = document.getElementById("in-r-expr");
    in_r_expr.addEventListener("input", function() { UpdateExpr('r', this.value); });
    UpdateExpr('r', in_r_expr.value);
    var in_g_expr = document.getElementById("in-g-expr");
    in_g_expr.addEventListener("input", function() { UpdateExpr('g', this.value); });
    UpdateExpr('g', in_g_expr.value);
    var in_b_expr = document.getElementById("in-b-expr");
    in_b_expr.addEventListener("input", function() { UpdateExpr('b', this.value); });
    UpdateExpr('b', in_b_expr.value);
  }

  function ResizeCanvas() {
    Canvas.width = parseInt(document.getElementById("in-width").value);
    Canvas.height = parseInt(document.getElementById("in-height").value);
    Context = Canvas.getContext("2d");
    ImageData = Context.createImageData(Canvas.width, Canvas.height);
  }

  function UpdateExpr(colorChannel, expr) {
    switch(colorChannel.toLowerCase()) {
      case 'r':
        Expressions.r = expr;
        break;
      case 'g':
        Expressions.g = expr;
        break;
      case 'b':
        Expressions.b = expr;
    }
  }

  function SetupCanvas() {
    Canvas = document.getElementById("canvas");
    Context = Canvas.getContext("2d");
    ImageData = Context.createImageData(Canvas.width, Canvas.height);
    window.requestAnimationFrame(DrawCanvas);
  }

  function DrawCanvas(timestamp) {
    var width = ImageData.width;
    var height = ImageData.height;

    var rError = false, gError = false, bError = false;
    try { eval(Expressions.r) } catch(e) { rError = true; }
    try { eval(Expressions.g) } catch(e) { gError = true; }
    try { eval(Expressions.b) } catch(e) { bError = true; }

    t = timestamp / 1000.0;

    for(var yPix = 0; yPix < height; ++yPix) {
      for(var xPix = 0; xPix < width; ++xPix) {
        x = xPix / width;
        y = yPix / height;
        var r = 0.0, g = 0.0, b = 0.0;
        /*var r = parseInt(eval(Expressions.r) * 255.0);
        var g = parseInt(eval(Expressions.g) * 255.0);
        var b = parseInt(eval(Expressions.b) * 255.0);*/
        if(!rError) r = parseInt(eval(Expressions.r) * 255.0);
        if(!gError) g = parseInt(eval(Expressions.g) * 255.0);
        if(!bError) b = parseInt(eval(Expressions.b) * 255.0);
        var index = (width * yPix + xPix) * 4;
        ImageData.data[index + 0] = r;
        ImageData.data[index + 1] = g;
        ImageData.data[index + 2] = b;
        ImageData.data[index + 3] = 255;
      }
    }

    Context.putImageData(ImageData, 0, 0);
    if(RunChecked) {
      window.requestAnimationFrame(DrawCanvas);
    }
  }




  RegisterEvents();
  SetupCanvas();
})();