const drawingArea = workbench.builder.get_object("drawing_area");
const scaleRotate = workbench.builder.get_object("scale");

const triangle = [3];
triangle[0] = [2];
triangle[0][0] = 100;
triangle[0][1] = 100;
triangle[1] = [2];
triangle[1][0] = 0;
triangle[1][1] = -100;
triangle[2] = [2];
triangle[2][0] = -100;
triangle[2][1] = 100;
const triangle_original = [3];
for (let i = 0; i < 3; i++) {
  const temp = [2];
  temp[0] = triangle[i][0];
  temp[1] = triangle[i][1];
  triangle_original[i] = temp;
}

drawingArea.set_draw_func((area, cr, width, height) => {
  // Draw triangle in context
  cr.moveTo(150 + triangle[0][0], 150 + triangle[0][1]);
  cr.lineTo(150 + triangle[1][0], 150 + triangle[1][1]);
  cr.lineTo(150 + triangle[2][0], 150 + triangle[2][1]);
  cr.lineTo(150 + triangle[0][0], 150 + triangle[0][1]);

  cr.setSourceRGBA(1, 0, 1, 1);
  cr.stroke();
  // Freeing the context before returning from the callback
  cr.$dispose();
});

scaleRotate.connect("value-changed", () => {
  // Recalculate value of points of triangle
  for (let i = 0; i < 3; i++) {
    // Calculate original angle
    const x = triangle_original[i][0];
    const y = triangle_original[i][1];
    let angle = Math.atan(Math.abs(y) / Math.abs(x));
    if (x > 0 && y > 0) {
      angle = angle;
    }
    if (x < 0 && y > 0) {
      angle = Math.PI - angle;
    }
    if (x < 0 && y < 0) {
      angle = Math.PI + angle;
    }
    if (x > 0 && y < 0) {
      angle = Math.PI * 2 - angle;
    }
    if (x === 0) {
      if (y > 0) {
        angle = angle;
      }
      if (y < 0) {
        angle = -1 * angle;
      }
    }
    if (y === 0) {
      if (x > 0) {
        angle = angle;
      }
      if (x < 0) {
        angle = M_PI;
      }
    }
    // Add to original angle scale value
    angle += (scaleRotate.get_value() * Math.PI) / 180;
    // Set new value to triangle
    const radius = Math.sqrt(x * x + y * y);

    triangle[i][0] = radius * Math.cos(angle);
    triangle[i][1] = radius * Math.sin(angle);
  }
  // Redraw drawing_area
  drawingArea.queue_draw();
});
//https://www.cairographics.org/tutorial/
