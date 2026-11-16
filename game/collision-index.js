// Static building footprints are indexed once. Movement and camera probes only
// inspect the cell they occupy instead of scanning every building in both cities.
export function createCollisionIndex(colliders,cellSize=256){
 const cells=new Map();
 for(const c of colliders)for(let x=Math.floor((c.x-c.w)/cellSize);x<=Math.floor((c.x+c.w)/cellSize);x++)for(let z=Math.floor((c.z-c.d)/cellSize);z<=Math.floor((c.z+c.d)/cellSize);z++){const key=x+'|'+z;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(c);}
 return {contains(x,z,inset=0){const candidates=cells.get(Math.floor(x/cellSize)+'|'+Math.floor(z/cellSize));if(!candidates)return false;for(const c of candidates)if(Math.abs(x-c.x)<c.w-inset&&Math.abs(z-c.z)<c.d-inset)return true;return false;},cells:cells.size};
}
