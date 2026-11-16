// Hysteresis avoids frequent canvas reallocations when frame times hover near
// the target. A sustained slowdown lowers resolution; recovery needs a longer run.
export function createFrameQuality(initial=.9){
 let ratio=initial,average=16.7,slow=0,fast=0,cooldown=0;
 return {update(elapsed){const ms=Math.max(1,Math.min(100,elapsed)),dt=ms/1000;average+=(ms-average)*.06;cooldown=Math.max(0,cooldown-dt);slow=average>22?slow+dt:0;fast=average<17.5?fast+dt:0;
  if(!cooldown&&slow>.65&&ratio>.65){ratio=Math.max(.65,Math.round((ratio-.1)*100)/100);slow=fast=0;cooldown=2.5;return ratio;}
  if(!cooldown&&fast>8&&ratio<1){ratio=Math.min(1,Math.round((ratio+.05)*100)/100);slow=fast=0;cooldown=10;return ratio;}
  return null;
 },get ratio(){return ratio;},get average(){return average;}};
}
