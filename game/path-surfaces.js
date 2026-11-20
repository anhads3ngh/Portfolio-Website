import {subtractRectangle} from './road-network.js?v=20';

// Axis-aligned walks share one flat surface at corners, with no overlapping
// coplanar quads or stretched triangles at a turn.
export function walkSurfaces(points,width=35){
 const result=[];
 for(let i=1;i<points.length;i++){
  const [ax,az]=points[i-1],[bx,bz]=points[i];
  if(ax===bx&&az===bz)continue;
  if(ax!==bx&&az!==bz)throw new Error('Walkway corners must be orthogonal.');
  let pieces=[{minX:Math.min(ax,bx)-width/2,maxX:Math.max(ax,bx)+width/2,minZ:Math.min(az,bz)-width/2,maxZ:Math.max(az,bz)+width/2}];
  for(const existing of result)pieces=pieces.flatMap(piece=>subtractRectangle(piece,existing));
  result.push(...pieces);
 }
 return result;
}
