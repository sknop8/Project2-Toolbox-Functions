function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function smoothstep(a, b, t) {
  t = clamp((t - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Bias b [0,1]
 * Higher b => more time spent at beginning of transition
 * Lower b => more time spent at end of transition
 */
function bias(b, t) {
  return Math.pow(t, Math.log(b) / Math.log(0.5));
}

/** 
 * Gain g [0, 1]
 * Higher g => more time on the edges
 * Lower g => more time in the middle
 */
function gain(g, t) {
  if (t < 0.5) {
    return bias(1 - g, 2 * t) / 2;
  } else {
    return 1 - bias(1 - g, 2 - 2 * t) / 2;
  }
}


function wingCurve(pos) {
  var result = smoothstep(0, 1, pos);
  result = gain(0.1, result);
  return result;
}

function featherSpread(pos) {
  var result = smoothstep(0, 1, pos);
  result = bias(0.2, result);
  return result;
}

function featherRotation(pos) {
  var result = smoothstep(0, 1, pos);
  result = bias(0.2, result);
  result = gain(0.8, result);

  return result;
}

function featherSize(pos) {
  var result = smoothstep(0, 1, pos);
  result = bias(0.7, result);
  result = gain(0.2, result);

  return result;
}

function featherColor(pos) {
  var offset = smoothstep(0, 1, pos);
  offset = bias(0.8, offset);
  offset = gain(0.1, offset);
  offset *= 150;

  var color = [120 + offset, 110 + offset, 140 + offset];
  color[0] /= 255;
  color[1] /= 255;
  color[2] /= 255;

  return color;
}

/**
 * Noise generator modified from the one in HW1
 */
function noise_gen1(pos) {
  return (Math.sin(pos + 12.9898) * 43758.5453) % 1;
}

function windJitter(pos1, pos2) {
  var include = noise_gen1(pos1) > 0.7;
  var jitter = include * (noise_gen1(pos2) - 1);
  
  return jitter;
}

export default {
  wingCurve: wingCurve,
  featherSpread: featherSpread,
  featherRotation: featherRotation,
  featherSize: featherSize,
  featherColor: featherColor,
  windJitter: windJitter,
}