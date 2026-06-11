import * as THREE from 'three'

// One entry per journey stop (matches STOPS order in data/content.js).
// `focus` is where the 3D set piece lives; `cam`/`look` shape the camera ride.
// Focus pieces alternate sides so the HTML panel always has clear space.

export const ANCHORS = [
  { id: 'hero',        focus: [0, 0.5, -4],     cam: [0, 0.8, 6],      look: [0, 0.5, -4] },
  { id: 'about',       focus: [4.5, 0.5, -18],  cam: [-0.6, 1.0, -10], look: [2.2, 0.5, -18] },
  { id: 'experience',  focus: [-4.5, 1, -32],   cam: [0.6, 1.2, -24],  look: [-2.2, 1, -32] },
  { id: 'converge',    focus: [4.5, 0, -48],    cam: [-0.5, 0.8, -39], look: [2.4, 0.3, -48] },
  { id: 'truth-trail', focus: [-4.5, 0, -64],   cam: [0.5, 0.8, -55],  look: [-2.4, 0.4, -64] },
  { id: 'profpair',    focus: [4.5, 0, -80],    cam: [-0.5, 0.8, -71], look: [2.4, 0.3, -80] },
  { id: 'archipelago', focus: [-4.5, 0.5, -96], cam: [0.5, 1.2, -87],  look: [-2.4, 0.5, -96] },
  { id: 'skills',      focus: [4.5, 0.5, -110], cam: [-0.5, 0.8, -101],look: [2.4, 0.5, -110] },
  { id: 'contact',     focus: [0, 0.5, -126],   cam: [0, 0.8, -116],   look: [0, 0.5, -126] },
]

export const cameraCurve = new THREE.CatmullRomCurve3(
  ANCHORS.map((a) => new THREE.Vector3(...a.cam)),
)

export const lookTargets = ANCHORS.map((a) => new THREE.Vector3(...a.look))
